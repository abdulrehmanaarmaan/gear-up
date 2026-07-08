import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { adminServices } from "./admin.services"
import sendResponse from "../../utils/sendResponse"
import httpStatus from "http-status"

const { getUsersFromDB, updateStatusInDB, getGearsFromDB, getRentalOrders } = adminServices

const { OK, CONFLICT } = httpStatus

const getAllUsers = catchAsync(async (req: Request, res: Response) => {

    const users = await getUsersFromDB()

    sendResponse(res, {
        success: true,
        statusCode: OK,
        message: "Users retrieved successfully.",
        data: {
            users
        }
    })
})

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params
    const { status } = await req.body

    const user = await updateStatusInDB(id as string, status)

    if (user?.updatedStatus == false) {
        return sendResponse(res, {
            success: false,
            statusCode: CONFLICT,
            message: `User is already ${status.toLowerCase()}.`,
        })
    }

    sendResponse(res, {
        success: true,
        statusCode: OK,
        message: "User updated successfully.",
        data: {
            user
        }
    })
})

const getAllGearListings = catchAsync(async (req: Request, res: Response) => {

    const gears = await getGearsFromDB()

    sendResponse(res, {
        success: true,
        statusCode: OK,
        message: "Gear listings retrieved successfully.",
        data: {
            gears
        }
    })

})

const getAllRentalOrders = catchAsync(async (req: Request, res: Response) => {

    const rentalOrders = await getRentalOrders()

    sendResponse(res, {
        success: true,
        statusCode: OK,
        message: "Rental Orders retrieved successfully.",
        data: {
            rentalOrders
        }
    })
})

export const adminControllers = {
    getAllUsers,
    updateUserStatus,
    getAllGearListings,
    getAllRentalOrders
}