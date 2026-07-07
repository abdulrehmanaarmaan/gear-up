import Stripe from "stripe"
import { stripe } from "../../lib/stripe"
import { prisma } from "../../lib/prisma"
import { PaymentStatus } from "../../../generated/prisma/enums"

export const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {
    const { customerId, rentalOrderId } = session?.metadata!

    const stripeCustomerId = session?.customer as string
    const stripeSubscriptionId = session?.subscription as string
    if (!customerId || !stripeCustomerId || !stripeSubscriptionId) {
        throw new Error("Missing required metadata in the session object.")
    }
    const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId)
    const currentPeriodEnd = await getPeriodEnd(stripeSubscription)

    await prisma.payment.upsert({
        where: {
            customerId
        },
        create: {
            rentalOrderId: rentalOrderId as string,
            customerId,
            stripeCustomerId,
            stripeSubscriptionId,
            currentPeriodEnd
        },
        update: {
            stripeCustomerId,
            stripeSubscriptionId,
            currentPeriodEnd
        }
    })
}


export const getPeriodEnd = async (payload: Stripe.Subscription) => {
    const currentPeriodEndInMS = payload.items.data[0]?.current_period_end!
    const currentPeriodEnd = new Date(currentPeriodEndInMS * 1000)
    return currentPeriodEnd
}


export const handleChangeSubscription = async (payload: Stripe.Subscription) => {

    const { id: stripeSubscriptionId, status: payloadStatus } = payload

    const { COMPLETED, FAILED, EXPIRED } = PaymentStatus


    const status = (payloadStatus === 'active' || payloadStatus === 'trialing') ? COMPLETED :
        payloadStatus === 'canceled' ? FAILED : EXPIRED


    const currentPeriodEnd = await getPeriodEnd(payload)


    const subscription = await prisma.payment.findUnique({
        where: {
            stripeSubscriptionId
        }
    })


    if (!subscription) {
        return;
    }


    await prisma.payment.update({
        where: {
            stripeSubscriptionId
        },
        data: {
            status,
            currentPeriodEnd
        }
    })
}