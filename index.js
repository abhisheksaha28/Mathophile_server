/****************** IMPORRTING MODULES  ************************/ 
import express from 'express';
import dotenv from "dotenv";
import { connectDB } from './db/db.js';
import cors from "cors";
/****************** IMPORRTING DONE  ************************/ 

dotenv.config();


/****************** SETTING UP EXPRESS APP ************************/ 

const app=express();

 

app.use(express.json())
 
app.use(cors())



// $%$%$%%$%$ =====> USING THE ROUTES THAT WE SETUP
// app.use('/user' , userRoute);
// app.use('/residency',residencyRoute);

 

 

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

