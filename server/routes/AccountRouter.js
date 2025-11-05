import { Router } from "express";
const router = new Router()
import AccountController from "../controllers/AccountController.js";

router.get('/', AccountController.getAllAccounts)
router.get('/:id', AccountController.getOneAccount)


export default router