import { Router } from "express";
import apiKeyController from "../controllers/apiKeyController.js";
import authenticateToken from "../middleware/authenticationToken.js";

const router = Router();


router.get('/',authenticateToken,apiKeyController.getApiKey)

export default router