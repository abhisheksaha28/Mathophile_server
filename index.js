import express from 'express';
import dotenv from "dotenv";

dotenv.config();


const app = express()

const port = process.env.PORT;

app.listen(process.env.PORT , ()=>{
    console.log(`Server runnng on port: ${port}`)
})