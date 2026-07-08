import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma"
import { IGearFilters } from "./gear.interface"

const getGearsFromDB = async (payload: IGearFilters) => {

    const { category, price, brand } = payload!

    const where: Prisma.GearItemWhereInput = {};

    if (category) {
        where.categoryId = category;
    }

    if (brand) {
        where.brand = {
            equals: brand,
            mode: "insensitive"
        };
    }

    if (price) {
        where.pricePerDay = {
            lte: Number(price)
        };
    }

    const result = await prisma.gearItem.findMany({

        where,
        include: {
            provider: true,
            category: true,
            reviews: true,
            rentalOrders: true
        }
    })

    return result
}

const getSingleGear = async (id: string) => {

    const result = await prisma.gearItem.findUniqueOrThrow({

        where: {
            id
        },

        include: {
            provider: true,
            category: true,
            reviews: true,
            rentalOrders: true
        }
    })

    return result
}

const getCategories = async () => {

    const result = await prisma.category.findMany({
        include: {
            gearItems: true
        }
    })

    return result
}

export const gearServices = {
    getGearsFromDB,
    getSingleGear,
    getCategories
}