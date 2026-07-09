import { Response } from "express"

interface TResponse<T> {
    statusCode: number,
    success?: boolean,
    message?: string,
    data?: T
}

const sendResponse = async <T>(res: Response, response: TResponse<T>) => {

    try {
        const { statusCode, success, message, data } = response

        res.status(statusCode).json({
            success,
            statusCode,
            message,
            data
        })
    }
    catch (error: any) {
        throw new Error(error.message)
    }
}

export default sendResponse