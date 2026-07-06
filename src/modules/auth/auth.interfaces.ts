import { UserRole, UserStatus } from "../../../generated/prisma/enums"

export interface IUser {
    name: string
    email: string
    password: string
    phone?: string
    image?: string
    role?: UserRole
    status?: UserStatus
    isVerified?: boolean
    address?: string
    city?: string
    country?: string
}

export interface ILoginUser {
    email: string
    password: string
}