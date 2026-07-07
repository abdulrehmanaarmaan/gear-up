import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { paymentServices } from "./payment.services"
import sendResponse from "../../utils/sendResponse"
import httpStatus from "http-status"

const { createPaymentInDB, handleWebhook } = paymentServices

const { OK } = httpStatus

const createPayment = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.user!

    const paymentUrl = await createPaymentInDB(id)

    sendResponse(res, {
        success: true,
        statusCode: OK,
        message: "Checkout completed successfully.",
        data: {
            paymentUrl
        }
    })
})

const verifyPayment = () => {

}

const getMyPayments = () => {

}

const getPaymentDetails = () => {

}

const handleStripeWebhook = catchAsync(async (req: Request, res: Response) => {
    const event = req.body
    const signature = req.headers['stripe-signature'] as string
    await handleWebhook(event, signature)
    sendResponse(res, {
        success: true,
        statusCode: OK,
        message: "Webhook handled successfully."
    })
})

export const paymentControllers = {
    createPayment,
    verifyPayment,
    getMyPayments,
    getPaymentDetails,
    handleStripeWebhook
}