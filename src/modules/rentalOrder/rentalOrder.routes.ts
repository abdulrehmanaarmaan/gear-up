import { Router } from "express";
import { rentalOrderControllers } from "./rentalOrder.controllers";
import auth from "../../middlewares/auth";
import authorize from "../../middlewares/authorize";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router()

const { createRentalOrder, getMyRentalOrders, getOrderDetails } = rentalOrderControllers

const { CUSTOMER } = UserRole

router.post('/', auth(), authorize(CUSTOMER), createRentalOrder)

router.get('/', auth(), authorize(CUSTOMER), getMyRentalOrders)

router.get('/:id', auth(), authorize(CUSTOMER), getOrderDetails)

export const rentalOrderRoutes = router