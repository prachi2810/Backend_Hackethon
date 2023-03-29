const UserModel = require("../Model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Key = process.env.USER_KEY;
const otpGenerator = require("otp-generator");
const mailer = require("nodemailer");
const { registermail, OTPmail } = require("./mailer");
const { response } = require("express");
const userModel = require("../Model/userModel");

async function verifyUser(req, res) {
  const token = req.cookies.token;
  try {
    if (!token) {
      res.status(401).send("Access denied..");
    } else {
      const decoded = jwt.verify(token, Key);
      res.send(decoded);
    }
  } catch (err) {
    res.clearCookie("token");
    return res.status(400).send(err.messsage);
  }
}

async function check(req, res) {
  console.log("helk");
  res.send("hello");
}

async function register(req, res) {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password)
      return res.status(400).json({ error: "Please enter all values" });
    const existUser = await UserModel.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (existUser)
      return res
        .status(409)
        .json({ message: "username or email already exists" });
    const user = new UserModel({
      email,
      username,
      password,
    });
    user.password = await bcrypt.hash(password, 10);
    await userModel.create(user);
    res.status(201).json({ message: "successfully created User" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}
async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Please enter all values" });
  existUsername = await UserModel.findOne({ username: username });
  if (existUsername) {
    const passwordCheck = await bcrypt.compare(
      password,
      existUsername.password
    );
    if (!passwordCheck)
      return res.status(400).json({ message: "Enter correct Password" });
    else {
      const token = jwt.sign(
        {
          userId: existUsername._id,
          username: existUsername.username,
          role:existUsername.role
        },
        Key,
        { expiresIn: "24h" }
      );
      return res
        .status(200)
        .cookie("token", token, { domain: "localhost", httpOnly: true })
        .json(existUsername);
    }
  } else {
    return res.status(400).json({ message: "Invalid Username" });
  }
}

async function getuser(req, res) {
  const { username } = req.params;

  try {
    if (!username) return res.status(501).send({ error: "Invalid Username!" });
    const user = await UserModel.findOne({ username });
    if (!user) return res.status(501).send({ error: "Couldn't find the user" });
    return res.status(201).send(user);
  } catch (error) {
    return res.status(404).send({ error: "Can't find User data" });
  }
}

async function logout(req, res) {
  res.clearCookie("token", { httpOnly: true }).sendStatus(200);
}

// async function updateuser(req, res) {

//     try {

//         const { id: userId } = req.query;
//         if (userId) {
//             const body = req.body;

//             UserModel.updateOne({ _id: userId }, body, function (err, data) {
//                 if (err) throw err;

//                 return res.status(201).send({ message: "Record Updated...!" });
//             });
//         } else {
//             return res.status(401).send({ error: "User not Found" });
//         }
//     } catch (error) {
//         return res.status(401).send({ error });
//     }
// }

async function generateOTP(req, res) {
    const {username}=req.params
    req.app.locals.OTP = await otpGenerator.generate(4, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });
    let OTP = req.app.locals.OTP;
    try{
    const user=await userModel.find({username:username})
    const response = await OTPmail({ OTP: OTP ,emailID:user[0].email});
        res.status(200).send({ msg: 'OTP send successfully!' });
      }
      catch(err){
          res.send('error')
      }

}

async function verifyOTP(req, res) {
    const { code } = req.query;
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null;
        req.app.locals.resetSession = true;
        return res.status(201).send({ message: "Verify Successfully" });
    }
    return res.status(400).send({ error: "Invalid OTP" });
}

// async function createResetSession(req, res) {
//     if (req.app.locals.resetSession) {
//         req.app.locals.resetSession = false;
//         return res.status(201).send({ message: "access granted" });
//     }
//     return res.status(440).send({ error: "Session expired" });
// }

// async function resetpassword(req, res) {
//     try {

//         if(!req.app.locals.resetSession)
//             return res.status(440).send({ error: 'Session expired' });

//         const { username, password } = req.body;

//         try {

//             UserModel.findOne({ username })
//                 .then(user => {
//                     bcrypt.hash(password, 10)
//                         .then(hashedPassword => {
//                             UserModel.updateOne({ username: user.username }, { password: hashedPassword },
//                                 function (err, data) {
//                                     if (err) throw err;
//                                     return res.status(201).send({ message: 'Password updated' })
//                                 });
//                         })
//                         .catch(error => {
//                             return res.status(500).send({ error: 'Enable to hash password' })
//                         })
//                 })
//                 .catch(error => {
//                     return res.status(404).send({ error: 'Username not found' });
//                 })

//         } catch (error) {
//             return res.status(500).send({ error })
//         }

//     } catch (error) {
//         return res.status(401).send({ error })
//     }
// }

async function forgotPassword(req, res) {
  try {
   
    const { username, password } = req.body;
    console.log(password)
    try {
      UserModel.findOne({ username })

        .then((user) => {
          bcrypt
            .hash(password, 10)

            .then((hashedPassword) => {
              UserModel.updateOne(
                { username: user.username },
                { password: hashedPassword },

                function (err, data) {
                  if (err) throw err;

                  return res.status(201).send({ message: "Password changed" });
                }
              );
            })

            .catch((error) => {
              return res.status(500).send({ error: "Enable to hash password" });
            });
        })

        .catch((error) => {
          return res.status(404).send({ error: "Username not found" });
        });
    } catch (error) {
      return res.status(500).send({ error });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
}

module.exports = {
  register,
  login,
  getuser,
  // updateuser,
   generateOTP,
   verifyOTP,
  // createResetSession,
  // resetpassword,
  forgotPassword,
  verifyUser,
  logout,
  check,
};