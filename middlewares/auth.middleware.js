import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


const isAuth = async (req, res, next) => {
    try {
      //token was send via headers , so we will fetch the token from headers
      const token = req.headers.token;
  
      if (!token)
        return res.status(403).json({
          message: "Please Login",
        });
  
      //if we got the token , then veriffy   the token
      const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  
      //fetch the user , from the db by using user id present in the token
      req.user = await User.findById(decodedData._id);
  
      //move to next function
      next();

    } catch (err) {
      res.status(500).json({
        message: "Login First",
        error:err.message
      });
    }
  };


  export { isAuth };