import express from "express";
import { isAdmin, isAuth } from "../middlewares/auth.middleware.js";
import { addLectures, createCourse, deleteCourse, deleteLecture, getAllStats, getAllUser, updateRole } from "../controllers/admin.controller.js";
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
//router.post("/course/new",isAuth,isAdmin,uploadFile.single('image') ,createCourse);

//router for adding lecture
//take id of the course, and token also from the user login
router.post("/course/:id",isAuth,isAdmin,uploadFile.fields([
    {
        name : "video",
        maxCount:1
    }
]),addLectures);

//route for deleting a resource
router.delete("/lecture/:id",isAuth,isAdmin,deleteLecture);

//route for deleting a course
router.delete("/course/:id",isAuth,isAdmin,deleteCourse);

//route for getting all stats
router.get("/stats",isAuth,isAdmin,getAllStats);

//route for getting all user
router.get("/users",isAuth,isAdmin,getAllUser);

//route for updating thr role of a user
router.put("/user/:id",isAuth,isAdmin,updateRole);


/***************************     SETTING UP THE ROUTES DONE**********************************/



export { router as adminRoutes};