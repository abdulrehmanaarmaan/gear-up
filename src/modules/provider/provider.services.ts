import { GearStatus, RentalStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import { IGear, IUpdateGear } from "./provider.interfaces"

const createGearInDB = async (payload: IGear, providerId: string) => {

    const result = await prisma.gearItem.create({
        data: {
            ...payload,
            providerId,
            availableQuantity: payload.quantity
        }
    })

    return result
}

const updateGearInDB = async (id: string, providerId: string, payload: IUpdateGear) => {

    const result = await prisma.gearItem.update({

        where: {
            id,
            providerId
        },

        data: {
            ...payload
        }
    })

    return result
}

const removeGearFromDB = async (id: string, providerId: string) => {

    const result = await prisma.gearItem.delete({
        where: {
            id,
            providerId
        }
    })

    return result
}

const getOrdersFromDB = async (providerId: string) => {

    const result = await prisma.rentalOrder.findMany({
        where: {
            providerId
        }
    })

    return result
}

const updateStatusInDB = async (id: string, providerId: string, status: RentalStatus) => {

    const createdOrder = await prisma.rentalOrder.findUnique({
        where: {
            id,
            providerId
        }
    })

    if (createdOrder?.status === status) {
        return {
            updatedStatus: false
        }
    }

    const result = await prisma.rentalOrder.update({
        where: {
            id,
            providerId
        },
        data: {
            status
        }
    })

    return {
        ...result,
        updateStatus: true
    }
}

export const providerServices = {
    createGearInDB,
    updateGearInDB,
    removeGearFromDB,
    getOrdersFromDB,
    updateStatusInDB,
}