import express from "express"
import cookieParser from "cookie-parser"
import { authRouter } from "./routes/auth.routes.js"
const app = express()


app.use(express.json({limit:"50kb"}))
app.use(express.urlencoded({extended:true,limit:"50kb"}))
app.use(cookieParser())

app.use("/api/auth",authRouter)




export default app