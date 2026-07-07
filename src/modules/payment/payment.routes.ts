import { Router } from "express";
import { paymentControllers } from "./payment.controllers";
import auth from "../../middlewares/auth";

const router = Router()

const { createPayment, verifyPayment, getMyPayments, getPaymentDetails, handleStripeWebhook } = paymentControllers

router.post('/create', auth(), createPayment)

router.post('/confirm', verifyPayment)

router.get('/', getMyPayments)

router.get('/:id', getPaymentDetails)

router.post("/webhook", handleStripeWebhook)

export const paymentRoutes = router