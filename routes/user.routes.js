import express from 'express';
import { loginUser, myProfile, register, verifyUser } from '../controllers/user.controller.js';
import { isAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();



/***************************     SETTING UP THE ROUTES **********************************/


//route for registering  and otp sending to user
router.post("/user/register" , register);

//route for verifying the usser and creating the usser
router.post("/user/verify",verifyUser);

//route for user login
router.post("/user/login", loginUser);

//route for getting user profile(only for logged in and authenticated users)
router.get("/user/profile",isAuth,myProfile);


/***************************     SETTING UP THE ROUTES **********************************/

export { router as userRoutes };



//localhost:PORT/api/user/verify

// routes=>(path , middleware , controller)