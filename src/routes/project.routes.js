import { Router } from "express";
import {
  saveContractAddressHandle,
  getContractOwnerHandle,
  addProjectDataHandle,
  getProjectDataByIdHandle,
  getAllProjectsHandle,
  projectImagesHandle,

} from "../controllers/project.controllers.js";
import { upload } from "../utils/multer.js";

const router = Router();
router.route("/saveAddress").post(saveContractAddressHandle);
router.route("/getAllContractOwners").get(getContractOwnerHandle);
router.route("/getProjectData").get(getProjectDataByIdHandle);
router.route("/addProjectData").post(
  upload.fields([
    { name: "first_image_link", maxCount: 1 },
    { name: "second_image", maxCount: 1 },
    { name: "third_image", maxCount: 1 },
    { name: "projectstory_image", maxCount: 1 },
    { name: "video_link", maxCount: 1 },
  ]),
  addProjectDataHandle
);

router.route("/getAllProjects").get(getAllProjectsHandle)

// router.post('/addProjectData',upload.fields([
//   { name: 'first_image_link', maxCount: 1 },
//   { name: 'second_image', maxCount: 1 },
//   { name: 'third_image', maxCount: 1 },
//   { name: 'projectstory_image', maxCount: 1 },
//   { name: 'video_link', maxCount: 1 },
// ]),addProjectDataHandle)

router.route("/addProjectImageUrl", upload.fields()).post(projectImagesHandle);

export default router;
