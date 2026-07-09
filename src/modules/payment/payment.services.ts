import Stripe from "stripe"
import config from "../../config"
import { prisma } from "../../lib/prisma"
import { handleCheckoutCompleted } from "./payment.utils"
import { stripe } from "../../lib/stripe"
import { RentalStatus } from "../../../generated/prisma/enums"

const { app_url, stripe_webhook_secret } = config

const createCheckoutSession = async (userId: string, rentalOrderId: string) => {

    const transactionResult = await prisma.$transaction(async (tx) => {

        const user = await tx.user.findUniqueOrThrow({
            where: {
                id: userId
            },
            select: {
                id: true,
                email: true
            }
        })

        const previousPayment = await tx.payment.findFirst({
            where: {
                customerId: userId
            },
            select: {
                stripeCustomerId: true
            }
        })

        const { gear, totalAmount, customerId, status } = await tx.rentalOrder.findUniqueOrThrow({
            where: {
                id: rentalOrderId
            },
            include: {
                gear: true,
                customer: {
                    include: {
                        payments: true
                    }
                }
            }
        })

        if (customerId !== userId) {
            throw new Error("You are not allowed to pay for this rental order.");
        }

        if (status === RentalStatus.PAID) {
            throw new Error("This rental order has already been paid.");
        }

        const { email, id } = user

        let stripeCustomerId = previousPayment?.stripeCustomerId

        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email,
                metadata: {
                    userId: id
                }
            })

            stripeCustomerId = customer.id
        }

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "bdt",
                        product_data: {
                            name: gear.title
                        },
                        unit_amount: Number(totalAmount) * 100
                    },
                    quantity: 1
                }
            ],
            mode: "payment",
            customer: stripeCustomerId,
            payment_method_types: ["card"],
            success_url: `${app_url}/premium?success=true`,
            cancel_url: `${app_url}/payment?success=false`,
            metadata: {
                customerId,
                rentalOrderId
            }
        })

        return session.url
    })

    return transactionResult

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
        case "checkout.session.completed": {
            const session: Stripe.Checkout.Session = event.data.object
            await handleCheckoutCompleted(session)

            // Then define and call a method to handle the successful payment intent.
            // handlePaymentIntentSucceeded(paymentIntent);
            break
        }

        default:
            // Unexpected event type
            console.log(`Unhandled event type ${event.type}.`);
    }
}

const getPaymentsFromDB = async (customerId: string) => {

    const result = await prisma.payment.findMany({
        where: {
            customerId
        }
    })

    return result
}

const getSinglePayment = async (id: string, customerId: string) => {

    const result = await prisma.payment.findUnique({
        where: {
            id,
            customerId
        }
    })

    if (!result) {
        throw new Error("Payment not found.")
    }

    return result
}

export const paymentServices = {
    createCheckoutSession,
    handleWebhook,
    getPaymentsFromDB,
    getSinglePayment
}