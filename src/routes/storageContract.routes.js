import { Router } from "express";
import  { getOwnerHandle, isContractCreatedHandle, uploadMetaDataHandle, uploadImageHandle, createProjectHandle}  from "../controllers/storeageContract.Controllers.js";
import { upload } from "../utils/multer.js";
const router = Router()


//router.route('/events').get(getEventsHandle)


router.route('/owner').get(getOwnerHandle)
router.route('/check-contract').post(isContractCreatedHandle)
router.route('/uploadMetadata').post(uploadMetaDataHandle)
router.route('/uploadImage').post( upload.single("image"), uploadImageHandle)
router.route("/createProject").post(createProjectHandle)
export default router