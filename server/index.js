import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/db.js'
import authRouter from './routes/auth.route.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRouter from './routes/user.route.js'
import websiteRouter from './routes/website.route.js'
import billingRouter from './routes/billing.route.js'
import { stripeWebhook } from './controllers/webhook.controller.js'



const app=express()
app.post("/api/stripe/webhook",express.raw({type:"application/json"}),stripeWebhook)
const port=process.env.PORT||5000
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:["https://genwebai-2.onrender.com"],
    credentials:true
}))
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/website',websiteRouter)
app.use("/api/billing",billingRouter)


app.listen(port,()=>{
    connectDB();
    console.log("server started !!")
})
