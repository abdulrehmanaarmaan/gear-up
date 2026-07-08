export interface IRentalOrder {
    gearId: string
    quantity: number
    rentalStartDate: string
    rentalEndDate: string
    pickupAddress: string
    notes?: string
}