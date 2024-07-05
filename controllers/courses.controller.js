import { instance } from "../index.js";
import { Courses } from "../models/courses.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";
import { tryCatchHandler } from "../utils/tryCatchHandler.js";
import crypto from 'crypto';
import { Payment } from "../models/payment.model.js";


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


/************************ CONTROLLER FOR GETTING MY BUYED COURSES***********/
const getMyCourses = tryCatchHandler(async (req, res) => {
    const courses = await Courses.find({ _id: req.user.subscription });
  
    res.json({
      courses,
    });
  });
  /************************ CONTROLLER FOR GETTING MY BUYED COURSES DONE***********/


  /************************ CONTROLLER FOR CHECKING OUT ON A COURSE***********/
   const checkout = tryCatchHandler(async (req, res) => {
    //find user
    const user = await User.findById(req.user._id);
  
    //finf the course
    const course = await Courses.findById(req.params.id);
  
    //check if user already has buyed that course
    if (user.subscription.includes(course._id)) {
      return res.status(400).json({
        message: "You already have this course",
      });
    }
  
    //if not buyed, then move forward
    const options = {
      amount: Number(course.price * 100),//converting to paisa,smallest unit, so that there will be no issue of flaoting numbers
      currency: "INR",
    };
  
    //create an order
    const order = await instance.orders.create(options);
  
    res.status(201).json({
      order,
      course,
    });
  });


  const paymentVerification = tryCatchHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
  
    const body = razorpay_order_id + "|" + razorpay_payment_id;
  
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");
  
    const isAuthentic = expectedSignature === razorpay_signature;
  
    if (isAuthentic) {
      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
  
      const user = await User.findById(req.user._id);
  
      const course = await Courses.findById(req.params.id);
  
      user.subscription.push(course._id);
  
      await user.save();
  
      res.status(200).json({
        message: "Course Purchased Successfully",
      });
    } else {
      return res.status(400).json({
        message: "Payment Failed",
      });
    }
  });








export { getAllCourses , getSingleCourse , fetchLectures , fetchLecture , getMyCourses , checkout ,paymentVerification};