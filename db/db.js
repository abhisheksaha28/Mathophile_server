import mongoose from "mongoose";

 

const DB_NAME = process.env.MONGO_DB_NAME;

/****************** DATABASE CONNECTION SETUP  ************************/ 


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export  {connectDB};