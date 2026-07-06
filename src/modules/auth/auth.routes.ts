import { Router } from "express";
import { authControllers } from "./auth.controllers";

const router = Router()

const { createUser, loginUser, getMyAccount } = authControllers

router.post('/register', createUser)

router.post('/login', loginUser)

router.get('/me', getMyAccount)

export const authRoutes = router