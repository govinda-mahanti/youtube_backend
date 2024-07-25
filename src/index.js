import dotenv from "dotenv";
import connectDB from "./db/index.js"
import { app } from "./app.js";

// Loading environment variables
dotenv.config({
    path: './env'
})

// Connecting to the database
connectDB()
.then(()=>{
    // If the connection is successful, connect to the MongoDB database using mongoose    
    app.on("errror",(error)=>{
        console.log("ERROR: ",error);
        throw error
    })

    // Starting the server and listening on the specified port
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server is running in port ${process.env.PORT}`) 
    })
})
.catch((err)=>{
    console.log("ERROR: ",err)
})














//----------------------------------------------------------OR------------------------------------------------------------

/*
import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express";
const app = express()

;(async ()=>{
    //iffi function 
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
