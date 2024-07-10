
import { extractPublicIdFromUrl } from "../helpers/uriID.js";
import { determineResourceType } from "../helpers/uriType.js";
import { Courses } from "../models/courses.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary,deleteFromCloudinary } from "../utils/cloudinary.js";
import { tryCatchHandler } from "../utils/tryCatchHandler.js";


/************************ CONTROLLER FOR COURSE CREATION ************/



const createCourse =  tryCatchHandler( async(req,res) => {

     

    //get hold of all details required
    const { title, description, category, createdBy, duration, price } = req.body;
     

    //image field
    //the image will first get stored on local storage and then to cloudinary
    //local storaage means on our this srver ffile code
    const imageLocalPath = req.files?.image[0]?.path;
    //in above code , ?. is used bec, if there is no img, then srver should not crassh, instead below response should be sent
     
    //if no image found
    if(!imageLocalPath){
        return res.status(400).json({message:"Image is necessary"});
    }
     

    //now, upload the image on cloudinary
    const image = await uploadOnCloudinary(imageLocalPath);
     

    //for any reason, if not uploaded to cloudinary, then show error
    if(!image){
        return res.status(500).json({message:"Some error occured while uploading file"});

    }

    //if everything ok,ccreate the couse
    const courseCreated = await Courses.create({
        title,
        description,
        category,
        createdBy,
        //image: image?.path,
        image: image.url, //since reqd field, ad all cases handled earlier
        duration,
        price,
    });

    res.status(201).json({
        message: "Course Created Successfully",
        course: courseCreated,
      });
    });

    /************************ CONTROLLER FOR COURSE CREATION DONE ************/



    /************************ CONTROLLER FOR ADDING LECTURE ************/

    const addLectures = tryCatchHandler( async(req,res) => {

        //find course by id
        const course = await Courses.findById(req.params.id);

    if (!course)
    return res.status(404).json({
      message: "No Course found",
    });

    //f founded he course, take data 
  const { title, description } = req.body;

  //const file = req.file;
  const videoLocalPath = req.files?.video[0]?.path;

   //if no image found
   if(!videoLocalPath){
    return res.status(400).json({message:"no lecture added"});
}
 

//now, upload the video on cloudinary
const file = await uploadOnCloudinary(videoLocalPath);
 

//for any reason, if not uploaded to cloudinary, then show error
if(!file){
    return res.status(500).json({message:"Some error occured while uploading file"});

}

  const lecture = await Lecture.create({
    title,
    description,
    // video: file?.path,
    video: file.url,
    course: course._id,
  });

  res.status(201).json({
    message: "Lecture Added Succesfully",
    lecture,
  });

    });


    /************************ CONTROLLER FOR ADDING LECTURE DONE ************/



     /************************ CONTROLLER FOR DELETING LECTURE  ************/
    
    const deleteLecture = tryCatchHandler( async(req,res) => {

      //1st find the lecture to be deleted
      const lecture = await Lecture.findById(req.params.id);

      //find the cloudinary url of the lecture video from the db
      const uri = lecture.video;
       

      //get the cloudinary_id
       const publicID = extractPublicIdFromUrl(uri);
       //console.log(publicID);

       //get the file type
       const urlType = determineResourceType(uri);
       console.log(urlType);

      //now delete the video from  cloudinary
      const result = await deleteFromCloudinary(publicID,urlType);
       
      console.log("Resource deleted successfully")

      //delete the lecture from mongodb
      await lecture.deleteOne();

      res.status(200).json({ message: "Lecture Deleted Successfully" });
        

    });
    /************************ CONTROLLER FOR DELETING LECTURE DONE ************/



    /************************ CONTROLLER FOR DELETING COURSE ************/

    const deleteCourse = tryCatchHandler( async(req,res) => {

      //1.get the course
      const course = await Courses.findById(req.params.id);
      
      //2.get all the lectures
      const lectures = await Lecture.find({ course: course._id });

      //3.delete all the lectures first
      await Promise.all(
        lectures.map(async (lecture) => {
           //lecture url
           const uri = lecture.video;
          
           //cloudinary url
           const publicID = extractPublicIdFromUrl(uri);
           
           //file type
           const urlType = determineResourceType(uri);

           //delete from cloudinary
           await deleteFromCloudinary(publicID,urlType);

          console.log("video deleted");
        })
      );

      //4.delete the image
       //image url
       const uriImg = course.image;
          
       //cloudinary url
       const imgID = extractPublicIdFromUrl(uriImg);
       
       //file type
       const extType = determineResourceType(uriImg);

       //delete from cloudinary
       await deleteFromCloudinary(imgID,extType);

      console.log("image deleted");

      //now delete lecctures urls from db 
      await Lecture.find({ course: req.params.id }).deleteMany();

      //delete the course
      await course.deleteOne();

      //delete the course from user's subscriptions also
      await User.updateMany({}, { $pull: { subscription: req.params.id } });

      res.status(202).json({
        message: "Course Deleted Successfully",
      });


    });


    /************************ CONTROLLER FOR DELETING COURSE DONE************/


     
    /************************ CONTROLLER FOR ALL STATS************/

      const getAllStats = tryCatchHandler(async (req, res) => {
      const totalCoures = (await Courses.find()).length;
      const totalLectures = (await Lecture.find()).length;
      const totalUsers = (await User.find()).length;
    
      const stats = {
        totalCoures,
        totalLectures,
        totalUsers,
      };
    
      res.json({
        stats,
      });
    });
    /************************ CONTROLLER   DONE************/

    const getAllUser = tryCatchHandler(async (req, res) => {
      const users = await User.find({ _id: { $ne: req.user._id } }).select(
        "-password"
      );
    
      res.json({ users });
    });
    
    const updateRole = tryCatchHandler(async (req, res) => {
      const user = await User.findById(req.params.id);
    
      if (user.role === "user") {
        user.role = "admin";
        await user.save();
    
        return res.status(200).json({
          message: "Role updated to admin",
        });
      }
    
      if (user.role === "admin") {
        user.role = "user";
        await user.save();
    
        return res.status(200).json({
          message: "Role updated",
        });
      }
    });



 


export { createCourse , addLectures , deleteLecture , deleteCourse , getAllStats , getAllUser , updateRole };
