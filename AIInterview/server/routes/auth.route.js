import express from 'express'
import { googleAuth, logout } from '../controller/auth.contoller.js'

const authRouter = express.Router()
authRouter.post("/google",googleAuth)
authRouter.get("/logout",logout)

export default authRouter