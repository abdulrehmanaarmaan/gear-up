import { Router } from "express";
import { createReview } from "./review.controller";
import authorize from "../../middlewares/authorize";
import { UserRole } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";

const router = Router()

router.post('/', auth(), authorize(UserRole.CUSTOMER), createReview)

export const reviewRoute = router