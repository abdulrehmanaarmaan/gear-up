import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { providerServices } from "./provider.services"
import sendResponse from "../../utils/sendResponse"
import httpStatus from "http-status"

const { createGearInDB, updateGearInDB, removeGearFromDB, getOrdersFromDB, updateStatusInDB } = providerServices

const { CREATED, OK, CONFLICT } = httpStatus

const addGear = catchAsync(async (req: Request, res: Response) => {

    const { body, user } = req
    const { id } = user!

    const addedGear = await createGearInDB(body, id)

    sendResponse(res, {
        success: true,
        statusCode: CREATED,
        message: "Gear added successfully.",
        data: addedGear
    })
})

const updateGear = catchAsync(async (req: Request, res: Response) => {

    const { params, body, user } = req

    const updatedGear = await updateGearInDB(params.id as string, user?.id!, body.status)

    sendResponse(res, {
        success: true,
        statusCode: OK,
        message: "Gear updated successfully.",
        data: updatedGear
    })
})

const removeGear = catchAsync(async (req: Request, res: Response) => {

    const { params, user } = req

    const removedGear = removeGearFromDB(params.id as string, user?.id!)

    sendResponse(res, {
        success: true,
        statusCode: OK,
        message: "Gear removed successfully.",
        data: removedGear
    })

})

const getMyOrders = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.user!

    const myOrders = await getOrdersFromDB(id)

    sendResponse(res, {
        success: true,
        statusCode: OK,
        message: "Orders retrieved successfully.",
        data: myOrders
    })

})

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {

    const { params, user, body } = req

    const { status } = body

    const order = await updateStatusInDB(params.id as string, user?.id!, status)

    if (order?.updatedStatus == false) {
        return sendResponse(res, {
            success: false,
            statusCode: CONFLICT,
            message: `Order is already ${status.toLowerCase(status)}.`,
        })
    }

    sendResponse(res, {
        success: true,
        statusCode: OK,
        message: "Order status updated successfully.",
        data: order
    })
})

export const providerControllers = {
    addGear,
    updateGear,
    removeGear,
    getMyOrders,
    updateOrderStatus
}