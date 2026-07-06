import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { authServices } from "./auth.services"
import sendResponse from "../../utils/sendResponse"
import httpStatus from "http-status"

const { CREATED, FOUND } = httpStatus

const { createUserInDB, authorizeUserFromDB } = authServices

const createUser = catchAsync(async (req: Request, res: Response) => {

    const result = await createUserInDB(req.body)

    sendResponse(res, {
        success: true,
        statusCode: CREATED,
        message: "User created successfully.",
        data: [
            result
        ]
    })
})

const loginUser = catchAsync(async (req: Request, res: Response) => {

    const { result, accessToken, refreshToken } = await authorizeUserFromDB(req.body)

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7
    })

    sendResponse(res, {
        success: true,
        statusCode: FOUND,
        message: "User authorized successfully.",
        data: [
            result
        ]
    })
})

const getMyAccount = () => {

}

export const authControllers = {
    createUser,
    loginUser,
    getMyAccount
}