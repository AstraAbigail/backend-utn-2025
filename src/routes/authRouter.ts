import { Router } from "express"
import AuthController from "../controllers/authController"

const authRouter = Router()

// http://localhost:3000/auth/register
authRouter.post("/register", AuthController.register)
// http://localhost:3000/auth/login
authRouter.post("/login", AuthController.login)

export default authRouter