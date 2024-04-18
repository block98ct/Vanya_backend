import { Router } from "express"
import {addProjectDataHandle, saveContractAddressHandle} from "../controllers/project.controllers.js"


const router = Router()
router.route("/add-project-data").post(addProjectDataHandle)
router.route("/save-address").post(saveContractAddressHandle)
export default router;



