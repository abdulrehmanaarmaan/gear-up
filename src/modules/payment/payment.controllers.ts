import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { paymentServices } from "./payment.services"
import sendResponse from "../../utils/sendResponse"
import httpStatus from "http-status"

const { createCheckoutSession, handleWebhook, getPaymentsFromDB, getSinglePayment } = paymentServices

const { OK, BAD_REQUEST } = httpStatus

const createPayment = catchAsync(async (req: Request, res: Response) => {

    const { user, body } = req
    const { rentalOrderId } = await body

    if (!rentalOrderId) {
        return sendResponse(res, {
            success: false,
            statusCode: BAD_REQUEST,
            message: "Rental order ID is required."
        })
    }

    const checkoutUrl = await createCheckoutSession(user?.id!, rentalOrderId)

    sendResponse(res, {
        success: true,
        statusCode: OK,
        message: "Payment session created successfully.",
        data: checkoutUrl
    })
})

const handleStripeWebhook = catchAsync(async (req: Request, res: Response) => {
    const event = req.body
    const signature = req.headers['stripe-signature'] as string
    await handleWebhook(event, signature)
    sendResponse(res, {
        statusCode: OK
    })
})

const getMyPayments = catchAsync(async (req: Request, res: Response) => {

    const myPayments = await getPaymentsFromDB(req?.user?.id!)

    sendResponse(res, {
        success: true,
        statusCode: OK,
        message: "Payments retrieved successfully.",
        data: myPayments
    })

})

const getPaymentDetails = catchAsync(async (req: Request, res: Response) => {

    const { params, user } = req

    const paymentDetails = await getSinglePayment(params.id as string, user?.id!)

    sendResponse(res, {
        success: true,
        statusCode: OK,
        message: "Payment details retrieved successfully.",
        data: paymentDetails
    })
})

export const paymentControllers = {
    createPayment,
    handleStripeWebhook,
    getMyPayments,
    getPaymentDetails,
}