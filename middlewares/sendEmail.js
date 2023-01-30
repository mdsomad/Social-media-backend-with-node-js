const nodemailer = require("nodemailer");



exports.sendEmail = async (options)=>{
     
    // const transporter = nodemailer.createTransport({      //* this wark google gmail my account on --> by default of (Less secure app access)

    //     host: process.env.SMPT_HOST,
    //     port: process.env.SMPT_PORT,

    //     auth: {
    //       user: process.env.SMPT_MAIL, //* Admin Gmail ID
    //       pass: process.env.SMPT_PASSWORD, //* Admin Gmail Password
    //     },
        
    //     service:process.env.SMPT_SERVICE
          
    // });





    var transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "fe78fb99ebadac",
          pass: "ff247f6bbe2313"
        }
      });


    const mailOptions = {
        from:process.env.SMPT_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message
        
        
    }
    
    await transporter.sendMail(mailOptions);

}