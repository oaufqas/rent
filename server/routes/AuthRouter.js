import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import {body} from 'express-validator'
import authMiddleware from "../middleware/auth-middleware.js";
const router = new Router()


router.post('/register', 
    body('email').isEmail(),
    body('password').isLength({min: 6, max: 32}),
    AuthController.registration)

router.post('/login',
    body('email').isEmail(),
    body('password').isLength({min: 6, max: 32}), 
    AuthController.login)

router.post('/verify',
    body('code').isLength(6),
    AuthController.verifyLogin)

router.put('/verify-password',
    body('code').isLength(6),
    AuthController.verifyChangePassword)

router.post('/logout', AuthController.logout)
router.get('/activate/:link', AuthController.activate)
router.get('/refresh', AuthController.refresh)
router.get('/me', authMiddleware, AuthController.getMyInfo)
router.put('/profile',authMiddleware, AuthController.changeProfile)
router.put('/change-password', AuthController.changePassword)



export default router