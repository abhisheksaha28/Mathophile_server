//  ###### SELF_CORRECTION :- the below written code , is basically not a middleware, it is basically a Utility function ,but by mistake i wrote it as a middleware

import {createTransport} from "nodemailer";

//fn_name = async(req,res,next)=>

    
    const sendMail = async(email,subject,data) => {
        //1.recipients email 2.subject of that 3. content/body/payload of that email


        // create a transport object that defines the connection details for the SMTP server
        const transport = createTransport({
            host: "smtp.gmail.com",// Specifies the SMTP server host, heree its gmail's smtp server
            port: 465, // Port  used for secure SMTP (SMTPS) connections.
            secure: true,
            auth: {
                //method of creating the  password is writtem in .env & .env.sample 
              user: process.env.GMAIL_USER,//my email account , (bec i m the sender here)
              pass: process.env.GMAIL_PASSWORD,//password for the app created in my email account  
            },
          });


          //now lets write the texxt hat we want to send as the data to the user, it can either be a tet mmsg or a html body

          const html = `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>OTP Verification</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      margin: 0;
                      padding: 0;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      height: 100vh;
                  }
                  .container {
                      background-color: #fff;
                      padding: 20px;
                      border-radius: 8px;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                      text-align: center;
                  }
                  h1 {
                      color: red;
                  }
                  p {
                      margin-bottom: 20px;
                      color: #666;
                  }
                  .otp {
                      font-size: 36px;
                      color: #7b68ee; /* Purple text */
                      margin-bottom: 30px;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <h1>OTP Verification</h1>
                  <p>Hello ${data.name} your (One-Time Password) for your account verification is.</p>
                  <p class="otp">${data.otp}</p> 
                  <p>The OTP is valid for 3 minutes only</p>
              </div>
          </body>
          </html>
          `;
          

          //now send the maail
          await transport.sendMail({
            from: process.env.GMAIL_USER, // sender address,i.e,mine
            to: email,// list of receivers
            subject,// Subject line
            html,//html body
          });






    };

    export { sendMail };