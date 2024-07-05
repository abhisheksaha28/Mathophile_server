import { Courses } from "../models/courses.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";
import { tryCatchHandler } from "../utils/tryCatchHandler.js";


/************************ CONTROLLER FOR GETTING ALL COURSES ************/



const getAllCourses = tryCatchHandler( async(req,res) => {
    
    const courses = await Courses.find().sort({ createdAt: -1 });//getting the lates 1st
    res.status(202).json({
        message:"All Courses",
        courses
    });

});

/************************ CONTROLLER FOR GETTING ALL COURSE DONE ************/




/************************ CONTROLLER FOR GETTING A PARTICULAR COURSE ************/

const getSingleCourse = tryCatchHandler( async(req,res) => {

    const course = await Courses.findById(req.params.id);

    res.status(202).json({
        message:"Your desired course",
        course
    });

});
/************************ CONTROLLER FOR GETTING PARTICULAR COURSE DONE ************/



/************************ CONTROLLER FOR FETCHING LECTURES ************/


const fetchLectures = tryCatchHandler( async(req,res) =>{

    //find the course in which the lecture is there
    const lectures  = await Lecture.find({ course : req.params.id });

    //now see the user is allowed to fetch or not
    //if user is admin he can fetch everything, and if user has buyed this course, hen also he can see

    //1.find user
    const user = await User.findById(req.user._id);

    //2.check for admin
    if(user.role === "admin"){
        return res.status(202).json({ message:"Lectures Present in this Course" , lectures });
    }

    //3.if not admin, then check whether user has byed the course or not
    if(!user.subscription.includes(req.params.id)){
        return res.status(400).json({ message:"Buy the Course to see the content"});
    }

    //if above all fils, means the user has buyed
    res.status(202).json({ message:"Lectures contained in this Course" , lectures});

    


});


/************************ CONTROLLER FOR FETCHING LECTURES DONE************/



/************************ CONTROLLER FOR FETCHING A PARTICULAR LECTURE ************/


const fetchLecture = tryCatchHandler( async(req,res) =>{

    //find the course in which the lecture is there
    const lecture  = await Lecture.findById( req.params.id );

    //now see the user is allowed to fetch or not
    //if user is admin he can fetch everything, and if user has buyed this course, hen also he can see

    //1.find user
    const user = await User.findById(req.user._id);

    //2.check for admin
    if(user.role === "admin"){
        return res.status(202).json({ message:"Lecture  you asked for:-" , lecture });
    }

    //3.if not admin, then check whether user has byed the course or not
    if(!user.subscription.includes(req.params.id)){
        return res.status(400).json({ message:"Buy the Course to see the content"});
    }

    //if above all fils, means the user has buyed
    res.status(202).json({ message:"Lecture you desired:-" , lecture});

    


});


/************************ CONTROLLER FOR FETCHING PARTICULAR LEC DONE************/








export { getAllCourses , getSingleCourse , fetchLectures , fetchLecture };