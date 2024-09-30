import { Router } from "express";
import exportControllers from "../controllers/exportControllers.js";

const router = Router();



router.get('/export/Excel/users',exportControllers.exportUsersData)

router.get('/export/Excel/users/name',exportControllers.exportUsersDataByName)

router.get('/export/Excel/users/:id', exportControllers.exportUserData);

router.get('/export/PDF/users', exportControllers.exportUserDataPdf)

router.get('/export/PDF/users/:id', exportControllers.exportUserDataByIdPdf)

router.get('/export/CSV/users',exportControllers.exportUserDataToCsv)

router.get('/export/CSV/users/:id',exportControllers.exportUserDataToCsvByid)

export default router