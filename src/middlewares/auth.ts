import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken"
import config from "../config";
import { prisma } from "../lib/prisma";
import { UserRole, UserStatus } from "../../generated/prisma/enums";
import { jwtUtils } from "../utils/jwt";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string,
                email: string,
                role: UserRole
            }
        }
    }
}

const auth = () => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const { authorization } = req.headers

        const accessToken = req.cookies.accessToken || (authorization?.startsWith("Bearer") && authorization.split(" ")[1]) || authorization

        if (!accessToken) {
            throw new Error("Login to access authorized resources.")
        }

        const verifiedToken = await jwtUtils.verifyToken(accessToken, config.jwt_access_secret) as JwtPayload

        if (verifiedToken?.error) {
            throw new Error("The token provided is invalid.")
        }

        const { id, email, role } = verifiedToken

        const loggedUser = await prisma.user.findUniqueOrThrow({
            where: {
                id,
                email,
                role
            }
        })

        if (!loggedUser) {
            throw new Error("User not found. Please, create an account.")
        }

        if (loggedUser?.status === UserStatus.SUSPENDED) {
            throw new Error("Your account has been suspended by the admin.")
        }

        req.user = {
            id,
            email,
            role
        }

        next()
    })
}

export default auth