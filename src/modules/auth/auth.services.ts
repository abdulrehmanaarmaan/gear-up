import bcrypt from "bcryptjs"
import { prisma } from "../../lib/prisma"
import { ILoginUser, IUserAccount } from "./auth.interfaces"
import config from "../../config"
import { jwtUtils } from "../../utils/jwt"

const { bcrypt_salt_rounds, jwt_access_secret, jwt_access_expires_in, jwt_refresh_secret, jwt_refresh_expires_in } = config

const createAccountInDB = async (payload: IUserAccount) => {

    const { email, password } = payload

    const alreadyCreated = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (alreadyCreated) {
        throw new Error("Account already created.")
    }

    const hashedPassword = await bcrypt.hash(password, bcrypt_salt_rounds)

    const result = await prisma.user.create({
        data: {
            ...payload,
            password: hashedPassword
        }
    })

    return result
}

const loginUserFromDB = async (payload: ILoginUser) => {

    const { email, password: givenPassword } = payload

    const createdAccount = await prisma.user.findUnique({
        where: {
            email
        }
    })

    const { password, ...rest } = createdAccount!

    const matchedPassword = await bcrypt.compare(givenPassword, password)

    if (!matchedPassword) {
        throw new Error("The provided password is invalid.")
    }

    const { id, role } = rest

    const jwtPayload = {
        id,
        email,
        role
    }

    const { createToken } = jwtUtils

    const accessToken = createToken(
        jwtPayload,
        jwt_access_secret,
        jwt_access_expires_in
    )

    const refreshToken = createToken(
        jwtPayload,
        jwt_refresh_secret,
        jwt_refresh_expires_in

    )

    return {
        rest,
        accessToken,
        refreshToken
    }
}

const getAccountFromDB = async (id: string) => {

    const result = await prisma.user.findUniqueOrThrow({
        where: {
            id
        },
        omit: {
            password: true
        }
    })

    return result
}

export const authServices = {
    createAccountInDB,
    loginUserFromDB,
    getAccountFromDB
}