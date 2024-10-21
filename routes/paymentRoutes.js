import { Router } from "express";
import paymentControllers from "../controllers/paymentControllers.js";

const router = Router();

//crear pago con stripe
router.post('/stripe',paymentControllers.paymentStripe)

//crear un  pago con mercadopago

router.post('/mercadopago',paymentControllers.paymentMercadopago)

//crear pago con paypal
router.post('/paypal/createPayment',paymentControllers.createPaymentPaypal)

//capturar el pago despues de la aprobacion del cliente
//router.post('/paypal/capture-payment',paymentControllers.capturePaymentPaypal)

export default router