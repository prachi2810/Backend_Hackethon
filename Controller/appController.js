const UserModel = require("../Model/userModel");
const UserModelGoogle = require("../Model/userModelGoogle");
const {registermail,OTPmail}=require('./mailer');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const { response } = require("express");
const Key = process.env.USER_KEY;
async function verifyUser(req, res, next) {
    const token = req.cookies.token;

    try {
        if (!token) {
            res.status(401).send('Access denied..');
        }
        else {
            const decoded = jwt.verify(token, Key);
            res.send(decoded)
        }
    }
    catch (err) {
        res.clearCookie('token');
        return res.status(400).send(err.messsage);
    }
}


async function register(req, res) {

    try {
        const { email, username, password } = req.body;

        const existUser = await UserModel.findOne({
            $or: [{ username: username }, { email: email }],
        });

        if (existUser)
            return res
                .status(400)
                .json({ message: "username or email already exists" });
        if (!password)
            return res.status(400).json({ message: "Please Provide Password" });
        const user = new UserModel({
            email,
            username,
            password,
        });
        user.password = await bcrypt.hash(password, 10);
        await user.save();
        console.log(user)
        console.log("vvvgv");
        const response = await registermail({ username: user.username, userEmail: user.email });
        console.log(response);
        console.log("gggg");
        if (response.success === true) {
            console.log("oooo");
            res.status(200).send({ msg: 'User created successfully!' });
            }
        } catch (error) {
            res.status(500).send({ error: 'something went wrong' });
        }
}
async function registerByGoogle(req, res) {
    try {
        const { email, username } = req.body;

        const existUser = await UserModelGoogle.findOne({
            $or: [{ email: email }],
        });
        console.log(existUser)
        if (existUser)
            return res
                .status(400)
                .json({ message: "username or email already exists" });
        const user = new UserModelGoogle({
            email,
            username,
        });
        await user.save();
        res.status(201).json({ message: "successfully created User" });
    } catch (error) {
        return res.status(500).send(error);
    }

}
async function login(req, res) {
    const { username, password } = req.body;
    existUsername = await UserModel.findOne({ username: username });


    if (existUsername) {
        bcrypt.compare(password, existUsername.password).then((passwordCheck) => {
            if (!passwordCheck)
                return res.status(400).json({ message: "Don't have Password" });
            else {
                const token = jwt.sign(
                    {
                        userId: existUsername._id,
                        username: existUsername.username,
                    },
                    Key,
                    { expiresIn: "24h" }
                );
                res.status(200).cookie("token", token, { domain: 'localhost', httpOnly: true }).json(existUsername)
            }

        });
    } else {
        return res.status(400).json({ message: "Invalid Username" });
    }
}

async function loginByGoogle(req, res) {
    const { username, token } = req.body;
    existUsername = await UserModelGoogle.findOne({ username: username });
    if (existUsername) {
        const token = jwt.sign(
            {
                userId: existUsername._id,
                username: existUsername.username,
            },
            Key,
            { expiresIn: "24h" }
        );
        res.status(200).cookie("token", token, { domain: 'localhost', httpOnly: true }).json(existUsername)
    } else {
        return res.status(400).json({ message: "Invalid Username or user not found" });
    }
}
async function getuser(req, res) {
    // res.json('GetUser route');

    const { username } = req.params;

    try {
        if (!username) return res.status(501).send({ error: "Invalid Username!" });

        UserModel.findOne({ username }, function (err, user) {
            if (err) return res.status(500).send({ err });
            if (!user)
                return res.status(501).send({ error: "Couldn't find the user" });

            // const { password, ...rest } = user;

            return res.status(201).send(user);
        });
    } catch (error) {
        return res.status(404).send({ error: "Can't find User data" });
    }
}

async function logout(req, res) {
    res.clearCookie('token', { httpOnly: true }).sendStatus(200);;
}
async function updateuser(req, res) {
    // res.json('UpdateUser route');

    try {
        // const id = req.query.id;
        const { id: userId } = req.query;
        // console.log(userId);
        if (userId) {
            const body = req.body;

            UserModel.updateOne({ _id: userId }, body, function (err, data) {
                if (err) throw err;

                return res.status(201).send({ message: "Record Updated...!" });
            });
        } else {
            return res.status(401).send({ error: "User not Found" });
        }
    } catch (error) {
        return res.status(401).send({ error });
    }
}

async function generateOTP(req, res) {
    req.app.locals.OTP = await otpGenerator.generate(4, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });
    res.status(201).send({ code: req.app.locals.OTP });
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

async function createResetSession(req, res) {
    if (req.app.locals.resetSession) {
        req.app.locals.resetSession = false;
        return res.status(201).send({ message: "access granted" });
    }
    return res.status(440).send({ error: "Session expired" });
}



async function resetpassword(req, res) {
    try {

        if (!req.app.locals.resetSession)
            return res.status(440).send({ error: 'Session expired' });

        const { username, password } = req.body;

        try {

            UserModel.findOne({ username })
                .then(user => {
                    bcrypt.hash(password, 10)
                        .then(hashedPassword => {
                            UserModel.updateOne({ username: user.username }, { password: hashedPassword },
                                function (err, data) {
                                    if (err) throw err;
                                    return res.status(201).send({ message: 'Password updated' })
                                });
                        })
                        .catch(error => {
                            return res.status(500).send({ error: 'Enable to hash password' })
                        })
                })
                .catch(error => {
                    return res.status(404).send({ error: 'Username not found' });
                })

        } catch (error) {
            return res.status(500).send({ error })
        }

    } catch (error) {
        return res.status(401).send({ error })
    }
}

async function forgotPassword(req,res) {

    try {

 

        if (!req.app.locals.resetSession)

            return res.status(440).send({ error: 'Session expired' });

 

        const { username, password } = req.body;

 

        try {

 

            UserModel.findOne({ username })

                .then(user => {

                    bcrypt.hash(password, 10)

                        .then(hashedPassword => {

                            UserModel.updateOne({ username: user.username }, { password: hashedPassword },

                                function (err, data) {

                                    if (err) throw err;

                                    return res.status(201).send({ message: 'Password changed' })

                                });

                        })

                        .catch(error => {

                            return res.status(500).send({ error: 'Enable to hash password' })

                        })

                })

                .catch(error => {

                    return res.status(404).send({ error: 'Username not found' });

                })

 

        } catch (error) {

            return res.status(500).send({ error })

        }

 

    } catch (error) {

        return res.status(401).send({ error })

    }

}


module.exports = {
    register,
    login,
    getuser,
    updateuser,
    generateOTP,
    verifyOTP,
    createResetSession,
    resetpassword,
    verifyUser,
    logout,
    registerByGoogle,
    loginByGoogle,
    forgotPassword
};
