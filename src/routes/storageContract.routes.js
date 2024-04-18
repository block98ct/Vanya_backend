import { Router } from "express";
import  { getOwnerHandle, isContractCreatedHandle}  from "../controllers/storeageContract.Controllers.js";

const router = Router()


//router.route('/events').get(getEventsHandle)


router.route('/owner').get(getOwnerHandle)
router.route('/check-contract').post(isContractCreatedHandle)
export default router