import { Router } from "express";
import { 
    addRole, 
    loginUser, 
    registerUser, 
    logoutUser, 
    refreshAccessToken, 
    changePassword, 
    currentUser, 
    updateAccountDetails, 
    updateAvatar, 
    loginLocation,
    userAllLocatons,
    allUsers
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { verifyAdmin, verifyManager, verifyOwner } from "../middlewares/role.middleware.js";

const router = Router()

router.route("/register").post(verifyJWT, verifyManager,
    upload.fields([
        {
            name: "Avatar",
            maxCount: 1
        }
    ]),
    registerUser
    )
    
router.route("/addrole").post(verifyJWT, verifyAdmin, addRole)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT, logoutUser)

router.route("/refresh-token").get(refreshAccessToken)

router.route("/change-password").post(verifyJWT, changePassword)

router.route("/current-user").get(verifyJWT, currentUser)

router.route("/all-users").get(verifyJWT, verifyAdmin, allUsers)

router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/update-avatar").patch(verifyJWT, upload.single("Avatar"), updateAvatar)

router.route("/selected-location").post(verifyJWT, loginLocation )

router.route("/all-locations").get(verifyJWT, userAllLocatons)

export default router