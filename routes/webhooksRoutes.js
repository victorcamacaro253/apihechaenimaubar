import { Router } from "express"
import webhookController from "../controllers/webhookControllers.js"

const router=  Router()



router.post('/compra',webhookController.webhookCompra)



export default router