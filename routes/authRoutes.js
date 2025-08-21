import { Router } from "express"
import { register, login, getMe, forgotPassword } from "../controllers/authController.js"
import { protect } from "../middleware/auth.js"

const router = Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/me").get(protect, getMe)
router.route("/forgotpassword").post(forgotPassword)

export { router as authRouter }
