
import { Courses } from "../models/courses.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { tryCatchHandler } from "../utils/tryCatchHandler.js";

/************************ CONTROLLER FOR COURE CREATION ************/



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
      });
    });



 


export { createCourse };
