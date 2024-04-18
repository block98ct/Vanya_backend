import { Router } from "express";
import { userLoginHandle, userRegisterHandle, userLogoutHandle, updateUserPasswordHandle} from "../controllers/user.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/register').post(userRegisterHandle)
router.route('/login').post(userLoginHandle)
router.route('/logout').post(verifyJWT,userLogoutHandle)
router.route('/update-password').put(verifyJWT, updateUserPasswordHandle)




export default router;