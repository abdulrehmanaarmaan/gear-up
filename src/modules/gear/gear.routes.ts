import { Router } from "express";
import { gearControllers } from "./gear.controllers";

const router = Router()

const { getGears, getGearDetails, getGearCategories } = gearControllers

router.get('/gears', getGears)

router.get('/gears/:id', getGearDetails)

router.get('/categories', getGearCategories)

export const gearRoutes = router