import { Router } from "express";
import {
  getOwnerAddressHandle,
  getSymbolHandle,
  getProjectDataHandle,
  getCarbonAndNdviData,
  addProjectDataHandle,
  updateProjectDataHandle,
  issueCertificate
} from "../controllers/projectContract.controtllers.js";

const router = Router();
router.route("/owner").get(getOwnerAddressHandle);
router.route("/symbol").get(getSymbolHandle);
router.route("/details").get(getProjectDataHandle)
router.route("/carbon-ndvi").get(getCarbonAndNdviData)
router.route("/addProjectData").post(addProjectDataHandle)
router.route("/updateProject").post(updateProjectDataHandle)
router.route("/nft").post(issueCertificate)


export default router;
