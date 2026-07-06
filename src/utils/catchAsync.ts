import { NextFunction, Request, RequestHandler, Response } from "express"
import httpStatus from "http-status"
import sendResponse from "./sendResponse"

export const catchAsync = (fn: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next)
        }
        catch (error: any) {
            sendResponse(res, {
                success: false,
                statusCode: httpStatus.INTERNAL_SERVER_ERROR,
                message: error.message,
                error: (error as Error).message
            })
        }
    }
}