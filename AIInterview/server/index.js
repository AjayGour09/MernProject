import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/connectDB.js"
import cookieParser from "cookie-parser"
dotenv.config()
import cors from 'cors'
import authRouter from "./routes/auth.route.js"


const app = express()
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))



app.use(express.json())
app.use(cookieParser())

app.use("/api/auth" , authRouter)

const PORT = process.env.PORT ||6060
app.listen(PORT ,()=>{
    console.log(`Server running on port ${PORT}`)
    connectDB()
})