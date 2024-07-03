import { tryCatchHandler } from "../utils/tryCatchHandler.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendMail } from "../middlewares/mail.middleware.js";



/************************ CONTROLLER FOR REGISTERING AND SEND OTP TO USER ************/

 
const register  =  tryCatchHandler( async(req,res) =>{
    console.log("registering user");

    //get hold of the data from the user
    const{  name , email , password } = req.body;
    console.log(email);


    //checking user exists or not
    //either the user with the username or email will esxist, bec thhey are unique
    let user = await User.findOne({ email });

     

    //if user does not exxist , then send the verification details
    if(!user){
       

        //lets hash the password before saving 
        const salting = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password,salting);



        //now the user should take the updated value
        //since we used let, same variable function can be used again on changed hings
          user =  {
            //give all the parameters
            name,
            email,
            password: hashedPassword,
             
        }

        //sending otp , which is of 6 digits
        const otp = Math.floor(Math.random()*100000);

        //create a jwt for temporary access/verification purpose
        const activationToken = jwt.sign(
            //jwt.sign , creates a new token
            {
              //payload
              user,
              otp,
            },
            process.env.Activation_Secret, //secret key
            {
              expiresIn: "3m", //token expires within 3 minutes
            }
          );

          //setting up the data that we want to send to the user via email
          const data = {
            name,
            otp,
          };

          //send the data via the mail
          const otpSent = await sendMail(
            email,
            "MATHOPHILE user registration OTP", //subject
            data
          );

          //give resspone on sendin otp
          
            res.status(200).json({
                message : "OTP sent to yourr email",
                activationToken
            });
           
          //if otp not gone
          // else{
          //   res.status(500).json({ message:"Something went wrong while sendding OTP"})
          // }

  
    }

    //if user alredy exists
    else res.status(409).send({message:"User with this email already exists"})





});
/************************ CONTROLLER FOR REGISTERING DONE ************/


/************************ CONTROLLER FOR VERIFYING AND CREATING THE  USER ************/

const verifyUser = tryCatchHandler( async(req,res) => {

  //taking the otp and token fron user
  const { otp, activationToken } = req.body;

  //verify the inpued token with te actual one
  const verify = jwt.verify(activationToken, process.env.Activation_Secret);


  //our token contains the user and otp as payload  ,so check the otp firsst

  // 1. checking whether otp expired or not , since verify func created above also contains the expiry time of token
  if (!verify)
    return res.status(400).json({
      message: "Otp Expired",
    });
 

  // 2. checking whethet otp is correct or not, verify.otp= origibal otp sent via mail & otp=user inputed otp  
  if (verify.otp !== otp)
    return res.status(409).json({
      message: "Wrong Otp",
    });


  // if everything ok then create the user in the database  
  await User.create({
    name: verify.user.name,
    email: verify.user.email,
    password: verify.user.password,
  });

  res.status(201).json({
    message: "User Registered Successfully",
  });
});

/************************ CONTROLLER FOR VERIFYING AND CREATING THE  USER DONE ************/


/************************ CONTROLLER FOR USER LOGIN ***********************/

const loginUser =  tryCatchHandler( async(req,res) => {
  //ask email, password
  const { email, password } = req.body;

  //find user from db
  const user = await User.findOne({ email });

  if (!user)
    return res.status(404).json({
      message: "User does not exist",
    });


  //if user eists, match the passwords
  //match , password entered here by user with the password stored in db  
  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword)
    return res.status(400).json({
      message: "wrong Password",
    });

  //if credentials matches the end the token
  //here we will be using jwt bearer token, whoever has this token, will be eligible for all activities
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  //fields we dont want to send back to the user in response
  const loggedUser = await User.findById(user._id).select(" -password  -_id")

  res.status(200).json({
    message: `Welcome back ${user.name}`,
    token,
    user:loggedUser,
  });
});

/************************ CONTROLLER FOR USER LOGIN DONE***********************/


/************************ CONTROLLER FOR USER  PROFILE *************************/

  const myProfile = tryCatchHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -_id");
  //we found the req.user from the db, and dont want to give the passwod and id back in response

  res.status(202).json({ message:"Your Details:", user });
});

/************************ CONTROLLER FOR USER  PROFILE DONE *************************/



 
 



export { register, verifyUser , loginUser , myProfile };