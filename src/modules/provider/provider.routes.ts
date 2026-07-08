import { Router } from "express";
import { providerControllers } from "./provider.controllers";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";
import authorize from "../../middlewares/authorize";

const router = Router()

const { addGear, updateGear, removeGear, getMyOrders, updateOrderStatus } = providerControllers

const { PROVIDER } = UserRole

router.post("/gear", auth(), authorize(PROVIDER), addGear)

router.put('/gear/:id', auth(), authorize(PROVIDER), updateGear)

router.delete('/gear/:id', auth(), authorize(PROVIDER), removeGear)

router.get('/orders', auth(), authorize(PROVIDER), getMyOrders)

router.patch('/orders/:id', auth(), authorize(PROVIDER), updateOrderStatus)

export const providerRoutes = router