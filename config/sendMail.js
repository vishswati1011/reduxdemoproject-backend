const nodemailer = require('nodemailer');
  
//from who send the mail
let mailTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
  port: 465,
  secure: true,
  debug: true,
  auth: {
    user: "sv26703@gmail.com",
    pass: "**********",          //your email password
}
});
//to  who reveice the mail  
let mailDetails = {
    from: 'xyz@gmail.com',
    to: 'abc@gmail.com',
    subject: 'Test mail',
    text: 'Node.js testing mail for GeeksforGeeks'
};
  
// mailTransporter.sendMail(mailDetails, function(err, data) {
//     if(err) {
//         console.log('Error Occurs');
//     } else {
//         console.log('Email sent successfully');
//     }
// });

const sendMail= async (email, otp,subject) => {
        try{
            let html = `
            <p>Hi,<br>
            Mail is sent using node js nodemailler <br> 
            This is your otp:${otp} <br>          
            </p> 
            `;
            await mailTransporter.sendMail({
                from: 'sv26703@gmail.com',
                to: email,
                subject: subject,
                html: html
            }, function(err, data) {
                  if(err) {
                      console.log('Error Occurs');
                      return 0;
                  } else {
                      console.log('Email sent successfully');
                      return 1;
                  }
              })
        }catch(err)
        {

        }

}
module.exports=sendMail;
