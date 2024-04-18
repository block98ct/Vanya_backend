import { Router } from "express";
import   {getAllUsersHandle, adminLoginHandle, adminRegisterHandle, adminLogoutHandle, userDataSearchHandle, deleteUserHandle, getAllAddressWithOwner}    from "../controllers/admin.controllers.js"
import {verifyJWTAdmin}  from "../middlewares/admin.middleware.js"

const router = Router()


router.route("/register").post(adminRegisterHandle)

router.route("/all-users").get(verifyJWTAdmin,getAllUsersHandle)
router.route("/login").post(adminLoginHandle)
router.route("/logout").post(verifyJWTAdmin, adminLogoutHandle)
router.route("/users/search").get(verifyJWTAdmin, userDataSearchHandle)
router.route("/users/delete/:id").delete(verifyJWTAdmin, deleteUserHandle)
router.route("/all-contract-address").get(verifyJWTAdmin, getAllAddressWithOwner)




export default router