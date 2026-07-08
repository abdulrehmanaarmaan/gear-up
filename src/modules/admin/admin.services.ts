import { UserStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"

const getUsersFromDB = async () => {

    const result = await prisma.user.findMany({
        include: {
            payment: true,
            reviews: true,
            gearItems: true,
            customerOrders: true,
            providerOrders: true
        },
        omit: {
            password: true
        }
    })

    return result
}

const updateStatusInDB = async (id: string, status: UserStatus) => {

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    })

    if (user?.status === status) {
        return {
            updatedStatus: false
        };
    }

    const result = await prisma.user.update({

        where: {
            id
        },

        data: {
            status
        }
    })

    return {
        ...result,
        updatedStatus: true
    }
}

const getGearsFromDB = async () => {

    const result = await prisma.gearItem.findMany({
        include: {
            provider: true,
            category: true,
            reviews: true,
            rentalOrders: true,
        }
    })

    return result
}

const getRentalOrders = async () => {

    const result = await prisma.rentalOrder.findMany({
        include: {
            customer: true,
            provider: true,
            gear: true,
            payments: true,
            reviews: true,
        }
    })
    return result
}

export const adminServices = {
    getUsersFromDB,
    updateStatusInDB,
    getGearsFromDB,
    getRentalOrders
}