import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { authServices } from "./auth.services"
import sendResponse from "../../utils/sendResponse"
import httpStatus from "http-status"

const { CREATED, OK } = httpStatus

const { createAccountInDB, loginUserFromDB, getAccountFromDB } = authServices

const createUserAccount = catchAsync(async (req: Request, res: Response) => {

    const createdAccount = await createAccountInDB(req.body)

    sendResponse(res, {
        success: true,
        statusCode: CREATED,
        message: "User registered successfully.",
        data: createdAccount
    })
})

const loginUser = catchAsync(async (req: Request, res: Response) => {

    const { rest: loggedUser, accessToken, refreshToken } = await loginUserFromDB(req.body)

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
        statusCode: OK,
        message: "User logged successfully.",
        data: loggedUser
    })
})

const getMyAccount = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.user!

    const myAccount = await getAccountFromDB(id)

    sendResponse(res, {
        success: true,
        statusCode: OK,
        message: "Account retrieved successfully.",
        data: myAccount
    })
})

export const authControllers = {
    createUserAccount,
    loginUser,
    getMyAccount
}