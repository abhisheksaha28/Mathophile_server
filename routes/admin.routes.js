import express from "express";
import { isAdmin, isAuth } from "../middlewares/auth.middleware.js";
import { addLectures, createCourse } from "../controllers/admin.controller.js";
import { uploadFile } from "../middlewares/multer.middleware.js";


const router =  express.Router();


/***************************     SETTING UP THE ROUTES **********************************/

//route for creating a new course
router.post("/course/new",isAuth,isAdmin,uploadFile.fields([
     //fields accepts an array of field, below write all objeccts to be accepted here
     {
        name : "image",
        maxCount : 1
    }
]),createCourse);

//router for adding lecture
//take id of the course, and token also from the user login
router.post("/course/:id",isAuth,isAdmin,uploadFile.fields([
    {
        name : "video",
        maxCount:1
    }
]),addLectures);


/***************************     SETTING UP THE ROUTES DONE**********************************/



export { router as adminRoutes};