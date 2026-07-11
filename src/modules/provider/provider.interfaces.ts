import { GearCondition } from "../../../generated/prisma/enums"

interface GearSpecifications {
    frameMaterial?: string;
    wheelSize?: string;
    brakes?: string;
    gears?: string;
    suspension?: string;
    capacity?: string;
    waterproof?: boolean;
    material?: string;
    weight?: string;
    [key: string]: string | number | boolean | null | undefined;
}

export interface IGear {
    categoryId: string
    title: string
    slug: string
    description: string
    brand: string
    model?: string
    condition?: GearCondition
    pricePerDay: number
    quantity: number
    images: string[]
    specifications?: GearSpecifications
    location: string
}

export interface IUpdateGear {
    categoryId?: string;
    title?: string;
    slug?: string;
    description?: string;
    brand?: string;
    model?: string;
    condition?: GearCondition;
    pricePerDay?: number;
    quantity?: number;
    images?: string[];
    specifications?: GearSpecifications;
    location?: string;
    isAvailable?: boolean;
}