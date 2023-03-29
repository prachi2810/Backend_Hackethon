const nodemailer = require('nodemailer');

const Mailgen = require('mailgen');

const Email = process.env.EMAIL;

const Password = process.env.PASSWORD;

 

let nodeConfig = {

    service: 'gmail',

    // host: 'smtp.gmail.com',

    // port: 465,

    // secure: true,

    auth: {

      user: Email,

      pass: Password

    }

}

 

let transporter = nodemailer.createTransport(nodeConfig);

 

let MailGenerator = new Mailgen({

    theme: "salted",

    product : {

        name: "Webify",

        link: 'https://mailgen.js/'

    }

});

 

const registermail = async ({ username, userEmail }) => {

    // const { username, userEmail } = req.body;

    let mailDetails = {

        username,userEmail

    }

 

    var email = {
        body : {
            name: username,

            intro: 'Welcome to Webify!... We are very excited to have you on board.',

            outro: 'Need help, Just reply to this email'

        }

    }
    var emailBody = MailGenerator.generate(email);


    let message = {
        from: Email,
        to: userEmail,
        subject: "Signup Successful",
        html: emailBody
    }
    try{

        let info = await transporter.sendMail(message);
        console.log(info);
        return {

            success: true

        }

    }catch(error){

        return {

            success: false

        }

    }

 

}

 

const OTPmail = async({ OTP,emailID }) => {

    // console.log("abc");

    let OTPDetails = {

        OTP

    }

 

    var email = {

        body : {

            intro : `To verify your email address, please use the following One Time Password(OTP) ${OTP}

                        please do not share your OTP with anybody`,

            outro : 'Need help, Just reply to this email'

        }

    }

 

    var emailBody = MailGenerator.generate(email);

 

    let message = {

        from: Email,

        to: emailID,

        subject: "OTP Verification",

        html: emailBody

    }

    // console.log("abc");

 

    try{

        let info = await transporter.sendMail(message);

        return {

            success: true

        }

    }catch(error){

        return {

            success: false

        }

    }

}

module.exports ={ registermail, OTPmail};