import { prisma } from "../../lib/prisma";
import { IReview } from "./review.interface";

export const createReviewInDB = async (payload: IReview, customerId: string) => {

    const result = await prisma.review.create({
        data: {
            ...payload,
            customerId
        }
    })

    return result
}