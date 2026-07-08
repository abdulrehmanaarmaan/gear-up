import { Router } from "express";
import { gearControllers } from "./gear.controllers";
import auth from "../../middlewares/auth";

const router = Router()

const { getGears, getGearDetails, getGearCategories } = gearControllers

router.get('gears/', auth(), getGears)

router.get('gears/:id', auth(), getGearDetails)

router.get('/categories', auth(), getGearCategories)

export const gearRoutes = router