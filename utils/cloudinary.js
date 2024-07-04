import {v2 as cloudinary} from 'cloudinary';
 
//import fs from "fs";
import fs from 'fs-extra';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded



 
//configure the cloudinary          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});


//********* SETUP THE CODE FOR CLOUDINARY CONNECTION AND IT'S USAGE **********/

const uploadOnCloudinary = async (localFilePath) => {
    try {
       
        //if img not stored in local image
        if(!localFilePath) return null;  
         
        
        
        //upload the file in cloudinary,might take time so use await
        const response = await cloudinary.uploader.upload(localFilePath, {
          resource_type : "auto"  //it can be video,img, file, etc etc
          //if we have some specified things only, then we can specify, like img, video,etc
 
        })
         
        console.log("File is uploaded successfully on Cloudinary" , response.url);

        //if everything working fine, then we dont want to save the files in our local storage, lets unlink,i.e,delete them ssynchronously
        fs.unlinkSync(localFilePath);

        return response;

    }
    catch (error) {
       
      // remove the locally saved temporary file as the upload operation got failed
      fs.unlink(localFilePath) 
       
      return null;
    }
}


  export { uploadOnCloudinary };