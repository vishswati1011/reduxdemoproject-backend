const nodemailer = require('nodemailer');
  
//from who send the mail
let mailTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
  port: 465,
  secure: true,
  debug: true,
  auth: {
    user: "sv26703@gmail.com",
    pass: "Hacker$@123",
  },
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

const sendMailToUser = async (email, price) => {

    
        try{
            let html = `
            <p>Hi,<br>
            Mail is sent using node js nodemailler <br>            
            Your Sincerely
            </p> 
            `;
            await mailTransporter.sendMail({
                from: 'sv26703#gmail.com',
                to: 'sati.v1011@gmail.com',
                subject: 'Test mail',
                html: html
            })
        }catch(err)
        {

        }

}
module.exports={sendMailToUser};
