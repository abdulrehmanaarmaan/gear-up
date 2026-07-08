import { Router } from "express";
import { paymentControllers } from "./payment.controllers";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";
import authorize from "../../middlewares/authorize";

const router = Router()

const { createPayment, getMyPayments, getPaymentDetails, handleStripeWebhook } = paymentControllers
const { CUSTOMER } = UserRole

router.post('/create', auth(), authorize(CUSTOMER), createPayment)

router.post("/confirm", handleStripeWebhook)

router.get('/', auth(), authorize(CUSTOMER), getMyPayments)

router.get('/:id', auth(), authorize(CUSTOMER), getPaymentDetails)

export const paymentRoutes = router