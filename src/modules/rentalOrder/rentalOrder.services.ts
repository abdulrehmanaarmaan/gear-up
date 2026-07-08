import { prisma } from "../../lib/prisma"
import { IRentalOrder } from "./rentalOrder.interfaces"
import { differenceInCalendarDays } from "date-fns"

const createOrderInDB = async (payload: IRentalOrder, customerId: string) => {

    const { gearId, rentalStartDate, rentalEndDate, quantity } = payload

    const addedGear = await prisma.gearItem.findUnique({
        where: {
            id: gearId
        }
    })

    const totalDays = differenceInCalendarDays(rentalEndDate, rentalStartDate) + 1

    const { providerId, pricePerDay } = addedGear!

    const subtotal = Number(pricePerDay) * quantity * totalDays

    const serviceFee = subtotal * 0.10

    const totalAmount = subtotal + serviceFee

    const result = await prisma.rentalOrder.create({
        data: {
            ...payload,
            customerId,
            providerId,
            pricePerDay,
            totalDays,
            subtotal,
            serviceFee,
            totalAmount
        }
    })

    return result
}

const getOrdersFromDB = async (customerId: string) => {

    const result = await prisma.rentalOrder.findMany({

        where: {
            customerId
        },

        include: {
            customer: true,
            provider: true,
            gear: true,
            payments: true,
            reviews: true
        }
    })

    return result
}

const getSingleOrder = async (id: string, customerId: string) => {

    const result = await prisma.rentalOrder.findUniqueOrThrow({

        where: {
            id,
            customerId
        },

        include: {
            customer: true,
            provider: true,
            gear: true,
            payments: true,
            reviews: true
        }
    })

    return result
}

export const rentalOrderServices = {
    createOrderInDB,
    getOrdersFromDB,
    getSingleOrder
}