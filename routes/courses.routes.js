import express from "express";
import { fetchLecture, fetchLectures, getAllCourses, getSingleCourse } from "../controllers/courses.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";


const router =  express.Router();


/***************************     SETTING UP THE ROUTES **********************************/

//route for getting all courses
router.get("/course/all",getAllCourses);

//rouer for getting a particular course
router.get("/course/:id",getSingleCourse);

//router for getting all lectures of a course
router.get("/lectures/:id",isAuth,fetchLectures);

//router for getting  particular lecture of a course
router.get("/lecture/:id",isAuth,fetchLecture);


/***************************     SETTING UP THE ROUTES DONE**********************************/



export { router as courseRoutes};