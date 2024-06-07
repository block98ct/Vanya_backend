import { Router } from "express"
import { saveContractAddressHandle} from "../controllers/project.controllers.js"


const router = Router()
router.route("/save-address").post(saveContractAddressHandle)
export default router;



