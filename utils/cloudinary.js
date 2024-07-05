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


//for deleting from cloudinary , we not only need th cloudinary url_id of the media file , but alos we need to determine the type of the file(img,vid,text,etc)
//so here we will take 2 parameters , one for id and another for type
const deleteFromCloudinary = async (publicId,urlType) => {

  //we are taking he public id as a parameter,and we will delete the media file with ths parameter from cloudinary

  try {
    const result = await cloudinary.uploader.destroy(publicId,{
      resource_type: urlType
    });
    console.log('Resource deleted' );
    return result;
  } catch (error) {
    console.error('Error deleting resource:', error);
    throw error;
  }
};


  export { uploadOnCloudinary , deleteFromCloudinary };