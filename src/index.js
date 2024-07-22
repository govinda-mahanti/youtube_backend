// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
import connectDB from "./db/index.js"

dotenv.config({
    path: './env'
})


connectDB()

















/*
import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express";
const app = express()

;(async ()=>{
    try {
        mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("errror",(error)=>{
            console.log("ERROR: ",errror);
            throw error
        })

        app.listen(process.env.MONGODB_URI, ()=>{
            console.log(`App is listning on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("ERROR: ",error)
    }
})()
    */