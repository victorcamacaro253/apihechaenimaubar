import { Router } from "express";
import authentication from "../controllers/authController.js";


const router= Router();


router.post('/login',authentication.loginUser)

router.post('/logout',authentication.logoutUser)

router.post('/refreshAccessToken',authentication.refreshToken)


export default router