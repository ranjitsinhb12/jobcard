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
    allUsers,
    findRole,
    setDefaultLocation,
    updateCompanyId,
    allocateAllLocationToAdmin,
    userCompany
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

router.route("/allocate-admin-location").post(verifyJWT, verifyAdmin, allocateAllLocationToAdmin)


router.route("/all-roles").get(verifyJWT, verifyManager, findRole)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT, logoutUser)

router.route("/refresh-token").get(refreshAccessToken)

router.route("/change-password").post(verifyJWT, changePassword)

router.route("/current-user").get(verifyJWT, currentUser)

router.route("/all-users").get(verifyJWT, verifyAdmin, allUsers)

router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/update-avatar").patch(verifyJWT, upload.single("Avatar"), updateAvatar)

router.route("/selected-location").post(verifyJWT, loginLocation )

router.route("/all-companies").get(verifyJWT, userCompany)

router.route("/all-locations").get(verifyJWT, userAllLocatons)

router.route("/set-user-location").post(verifyJWT, setDefaultLocation)

router.route("/update-company").post(verifyJWT, verifyAdmin, updateCompanyId)





export default router