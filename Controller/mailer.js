const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

const Email = process.env.EMAIL;
const Password = process.env.PASSWORD;

let nodeConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: Email, // generated ethereal user
      pass: Password, // generated ethereal password
    }
}

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product : {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
})

const registermail = async (req, res) => {
    const { username, userEmail, text, subject } = req.body;

    var email = {
        body : {
            name: username,
            intro: text || 'Welcome to Webify!... We are very excited to have you on board.',
            outro: 'Need help, Just reply to this email' 
        }
    }

    var emailBody = MailGenerator.generate(email);

    let message = {
        from: Email,
        to: userEmail,
        subject: subject || "Signup Successful",
        html: emailBody
    }

    transporter.sendMail(message)
        .then(() => {
            return res.status(200).send({ message: "You should receive an email from us." })
        })
        .catch(error => res.status(500).send({ error }))
}

module.exports = registermail;