import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { gearServices } from "./gear.services"
import sendResponse from "../../utils/sendResponse"
import httpStatus from "http-status"

const { getGearsFromDB, getSingleGear, getCategories } = gearServices

const { OK } = httpStatus

const getGears = catchAsync(async (req: Request, res: Response) => {

    const gears = await getGearsFromDB(req.query)

    sendResponse(res, {
        success: true,
        statusCode: OK,
        message: "Gears retrieved successfully.",
        data: gears
    })

})

const getGearDetails = catchAsync(async (req: Request, res: Response) => {

    const gear = await getSingleGear(req.params.id as string)

    sendResponse(res, {
        success: true,
        statusCode: OK,
        message: "Gear details retrieved successfully.",
        data: gear
    })

})

const getGearCategories = catchAsync(async (req: Request, res: Response) => {

    const categories = await getCategories()

    sendResponse(res, {
        success: true,
        statusCode: OK,
        message: "Gear categories retrieved successfully.",
        data: categories
    })
})

export const gearControllers = {
    getGears,
    getGearDetails,
    getGearCategories
}