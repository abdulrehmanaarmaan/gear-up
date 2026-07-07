import Stripe from "stripe"
import config from "../../config"
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"
import { handleChangeSubscription, handleCheckoutCompleted } from "./payment.utils"

const { stripe_product_price_id, app_url, stripe_webhook_secret } = config

const createPaymentInDB = async (userId: string) => {

    const transactionResult = await prisma.$transaction(async (tx) => {

        const user = await tx.user.findUniqueOrThrow({
            where: {
                id: userId
            },
            include: {
                payment: true
            }
        })

        const { email, name, id, payment } = user

        let stripeCustomerId = payment?.stripeCustomerId

        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email,
                name,
                metadata: {
                    customerId: id
                }
            })

            stripeCustomerId = customer.id!
        }

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: stripe_product_price_id,
                    quantity: 1
                }
            ],
            mode: "subscription",
            customer: stripeCustomerId,
            payment_method_types: ["card"],
            success_url: `${app_url}/premium?success=true`,
            cancel_url: `${app_url}/payment?success=false`,
            metadata: {
                customerId: id,
                rentalOrderId: payment?.rentalOrderId as string
            }
        })

        return session.url
    })

    return transactionResult
}

const verifyPaymentFromDB = () => {

}

const getMyPaymentsFromDB = async (customerId: string) => {

    const result = await prisma.payment.findMany({
        where: {
            customerId
        }
    })

    if (!result.length) {
        return null
    }

    return result
}

const GetSinglePayment = async (id: string) => {

    const result = await prisma.payment.findUniqueOrThrow({
        where: {
            id
        }
    })

    return result
}

const handleWebhook = async (payload: Buffer, signature: string) => {

    const endpointSecret = stripe_webhook_secret


    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret
    )


    // Handle the event
    switch (event.type) {
        case "checkout.session.completed":
            const session: Stripe.Checkout.Session = event.data.object
            await handleCheckoutCompleted(session)

            // Then define and call a method to handle the successful payment intent.
            // handlePaymentIntentSucceeded(paymentIntent);
            break;
        case "customer.subscription.updated":
            await handleChangeSubscription(event.data.object)

            // Then define and call a method to handle the successful attachment of a PaymentMethod.
            // handlePaymentMethodAttached(paymentMethod);
            break;
        case "customer.subscription.deleted":
            await handleChangeSubscription(event.data.object)

            // Then define and call a method to handle the successful attachment of a PaymentMethod.
            // handlePaymentMethodAttached(paymentMethod);
            break;
        default:
            // Unexpected event type
            console.log(`Unhandled event type ${event.type}.`);
    }
}



export const paymentServices = {
    createPaymentInDB,
    verifyPaymentFromDB,
    getMyPaymentsFromDB,
    GetSinglePayment,
    handleWebhook
}