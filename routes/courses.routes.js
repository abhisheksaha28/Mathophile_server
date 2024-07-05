import express from "express";
import { checkout, fetchLecture, fetchLectures, getAllCourses, getMyCourses, getSingleCourse, paymentVerification } from "../controllers/courses.controller.js";
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

//route for getting all my courses
router.get("/mycourses/",isAuth,getMyCourses);

//route for checking out on courses
router.post("/course/checkout/:id",isAuth,checkout);

//route for payment verification
router.post("/verification/:id",isAuth,paymentVerification);


/***************************     SETTING UP THE ROUTES DONE**********************************/



export { router as courseRoutes};