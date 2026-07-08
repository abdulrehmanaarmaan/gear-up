import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { rentalOrderServices } from "./rentalOrder.services"
import sendResponse from "../../utils/sendResponse"
import httpStatus from "http-status"

const { createOrderInDB, getOrdersFromDB, getSingleOrder } = rentalOrderServices

const { CREATED, OK } = httpStatus

const createRentalOrder = catchAsync(async (req: Request, res: Response) => {

    const { body, user } = req

    const createdOrder = await createOrderInDB(body, user?.id!)

    sendResponse(res, {
        success: true,
        statusCode: CREATED,
        message: "Order created successfully.",
        data: createdOrder
    })
})

const getMyRentalOrders = catchAsync(async (req: Request, res: Response) => {

    const myOrders = await getOrdersFromDB(req?.user?.id!)

    sendResponse(res, {
        success: true,
        statusCode: OK,
        message: "Rental orders retrieved successfully.",
        data: myOrders
    })
})

const getOrderDetails = catchAsync(async (req: Request, res: Response) => {

    const { params, user } = req

    const orderDetails = await getSingleOrder(params.id as string, user?.id!)

    sendResponse(res, {
        success: true,
        statusCode: OK,
        message: "Order details retrieved successfully.",
        data: orderDetails
    })

})

export const rentalOrderControllers = {
    createRentalOrder,
    getMyRentalOrders,
    getOrderDetails
}