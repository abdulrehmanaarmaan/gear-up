import { PrismaClient } from "../generated/prisma/client"
import { adapter } from "../src/lib/prisma"

const prisma = new PrismaClient({ adapter })

async function main() {

    const categories = [
        {
            name: "Camping",
            slug: "camping",
            description: "Camping tents, sleeping bags, and outdoor shelter equipment."
        },
        {
            name: "Cycling",
            slug: "cycling",
            description: "Bicycles and cycling accessories."
        },
        {
            name: "Hiking",
            slug: "hiking",
            description: "Backpacks, trekking poles, and hiking equipment."
        },
        {
            name: "Climbing",
            slug: "climbing",
            description: "Climbing ropes, harnesses, helmets and safety gear."
        },
        {
            name: "Water Sports",
            slug: "water-sports",
            description: "Kayaks, paddleboards and water activity gear."
        },
        {
            name: "Winter Sports",
            slug: "winter-sports",
            description: "Skis, snowboards and winter equipment."
        },
        {
            name: "Photography",
            slug: "photography",
            description: "Cameras, lenses and photography accessories."
        },
        {
            name: "Fishing",
            slug: "fishing",
            description: "Fishing rods and tackle."
        },
        {
            name: "Fitness",
            slug: "fitness",
            description: "Fitness and workout equipment."
        },
        {
            name: "Travel",
            slug: "travel",
            description: "Travel gear and accessories."
        }
    ]

    for (const category of categories) {
        const result = await prisma.category.upsert({
            where: {
                slug: category.slug
            },
            update: {},
            create: category
        });

        console.log(`✔ ${result.name}`);
    }

    const count = await prisma.category.count();

    console.log("Total categories:", count);

}

main()