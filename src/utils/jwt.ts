import jwt, { SignOptions } from "jsonwebtoken"

interface JWTPayload {
    id: string,
    email: string
}

export const createToken = (payload: JWTPayload, jwtSecret: string, expiresIn: string) => {

    const accessToken = jwt.sign(
        payload,
        jwtSecret,
        { expiresIn } as SignOptions
    )

    return accessToken
}