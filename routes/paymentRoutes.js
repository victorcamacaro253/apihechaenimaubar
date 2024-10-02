import { Router } from "express";
import paymentControllers from "../controllers/paymentControllers.js";
const router = Router();

router.post('/stripe',paymentControllers.paymentStripe)

router.post('/mercadopago',paymentControllers.paymentMercadopago)


export default router