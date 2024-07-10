/****************** IMPORRTING MODULES  ************************/ 
import express from 'express';
import dotenv from "dotenv";
import { connectDB } from './db/db.js';
import cors from "cors";
import { userRoutes } from './routes/user.routes.js';
import { courseRoutes } from './routes/courses.routes.js';
import { adminRoutes } from './routes/admin.routes.js';
import Razorpay from 'razorpay';
/****************** IMPORRTING DONE  ************************/ 

//configure env
dotenv.config();

//create razorpay instance
export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });


/****************** SETTING UP EXPRESS APP ************************/ 

const app=express();

 

app.use(express.json())
 
//app.use(cors())
app.use( cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

//aibar amar je URL uida re o configure korte hoiobo
app.use(express.urlencoded({extended:true}))

//jodi ami amar njer server a kun media, like pdf,imge,etc  kunu kisu store kortam chai, uida ami public folder a store koira rakhi
//uuida re o configure kore hoy, static diya
app.use('/uploads',express.static("public/uploads"))



// $%$%$%%$%$ =====> USING THE ROUTES THAT WE SETUP
 
// app.use('/residency',residencyRoute);

 app.use('/api' , userRoutes);

 app.use('/api',courseRoutes);

 app.use('/api',adminRoutes);


 

 

/****************** EXPRESS APP SETUP DONE   ************************/ 



/****************** LISTENING OF APP AND CONNECTION WITH DB  ************************/

connectDB()
.then( ()=>{
    app.listen(process.env.PORT || 2811, ()=>{
        console.log(`Server is running at port: ${process.env.PORT}`);
    })
})
.catch( (err)=>{
    console.log("MongoDb connetion failed",err);
})

