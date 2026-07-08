import { Router } from "express";
import { authControllers } from "./auth.controllers";
import auth from "../../middlewares/auth";

const router = Router()

const { createUserAccount, loginUser, getMyAccount } = authControllers

router.post('/register', createUserAccount)

router.post('/login', loginUser)

router.get('/me', auth(), getMyAccount)

export const authRoutes = router