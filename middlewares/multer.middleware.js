 

import multer from "multer";


//************ CONFIGURE THE MULTER  ******/

// THE BELOW CODE IS DIRECTLY AVAILABLE IN THE DOCMENTATION, READ THAT

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //if req contains a normal data, can be easily configured, but files cant be,so we need multer
        //files here will be sent as a parameter to the cb callback func

      cb(null, "public/uploads")
    },
     
    filename: function (req, file, cb) {
       

      cb(null, file.originalname)
      //file.multiple_opttions ,  but we are going with the original name, though that's not a good practie
      //be tthe same user can upload multiple files with saame name, so ther will be over writing
      //but since the file is gonna be stored for a very small period of time, we can use this
      //+>>better was if we had provvided id's for each upload 

       
      
    }
  })
  
export const uploadFile = multer({ 
    storage, 
})