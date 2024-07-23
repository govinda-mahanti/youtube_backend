import express from "express" 
import cors from "cors" 
import cookieParser from "cookie-parser" 

const app = express()

// Setting up middleware to enable CORS with specified origin and credentials
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }))

app.use(express.json({ limit: "20kb" }))
app.use(express.urlencoded({ extended: true, limit: "20kb" }))

app.use(express.static("public"))

app.use(cookieParser())


//route import
import userRouter from "./routes/user.routes.js"

//routes declaration
app.use("/api/v1/users",userRouter)
// http://localhost:8000/api/v1/users/register

export { app }
