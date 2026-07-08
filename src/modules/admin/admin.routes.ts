import { Router } from "express";
import { adminControllers } from "./admin.controllers";
import authorize from "../../middlewares/authorize";
import { UserRole } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";

const router = Router()

const { getAllUsers, updateUserStatus, getAllGearListings, getAllRentalOrders } = adminControllers

const { ADMIN } = UserRole

router.get('/users', auth(), authorize(ADMIN), getAllUsers)

router.patch('/users/:id', auth(), authorize(ADMIN), updateUserStatus)

router.get('/gears', auth(), authorize(ADMIN), getAllGearListings)

router.get('/rentals', auth(), authorize(ADMIN), getAllRentalOrders)

export const adminRoutes = router