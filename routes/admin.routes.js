import express from "express";
import { isAdmin, isAuth } from "../middlewares/auth.middleware.js";
import { createCourse } from "../controllers/admin.controller.js";
import { uploadFile } from "../middlewares/multer.middleware.js";


const router =  express.Router();


/***************************     SETTING UP THE ROUTES **********************************/

//route for creatin a new course
router.post("/course/new",isAuth,isAdmin,uploadFile.fields([
     //fields accepts an array of field, below write all objeccts to be accepted here
     {
        name : "image",
        maxCount : 1
    }
]),createCourse);


/***************************     SETTING UP THE ROUTES DONE**********************************/



export { router as adminRoutes};