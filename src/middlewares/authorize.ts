import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../utils/catchAsync"
import { UserRole } from "../../generated/prisma/enums"

const authorize = (requiredRole: UserRole) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const { role } = req.user!

        if (role !== requiredRole) {
            throw new Error("As per you role, you are not authorized to access this resource.")
        }

        next()
    })
}

export default authorize