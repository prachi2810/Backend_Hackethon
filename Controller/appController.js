const UserModel = require("../Model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const Key = process.env.USER_KEY;

async function verifyUser(req, res, next) {
    try {
        const { username } = req.method == "GET" ? req.query : req.body;
        let exist = await UserModel.findOne({ username: username });
        // console.log(username);
        if (!exist) return res.status(404).send({ error: "Can't find User" });
        next()
    } catch (error) {
        return res.status(404).send({ error: "Auth error" });
    }
}

async function register(req, res) {
    try {
        const { email, username, password } = req.body;
        // console.log(email);
        // const existUsername = new Promise((resolve, reject) => {
        //     UserModel.findOne({ username }, function(err, user){
        //         if(err) reject(new Error(err))
        //         if(user) reject({ error : "Please use unique Username" });

        //         resolve();
        //     })
        // });
        const existUser = await UserModel.findOne({
            $or: [{ username: username }, { email: email }],
        });
        // const existEmail = new Promise((resolve, reject) => {
        //     UserModel.findOne({ email }, function(err, email){
        //         if(err) reject(new Error(err))
        //         if(email) reject({ error : "Please use unique Email" });

        //         resolve();
        //     })
        // });
        // console.log(existUser);
        if (existUser)
            return res
                .status(400)
                .json({ message: "username or email already exists" });
        if (!password)
            return res.status(400).json({ message: "Please Provide Password" });
        // console.log("password");
        const user = new UserModel({
            email,
            username,
            password,
        });
        // console.log("save");
        user.password = await bcrypt.hash(password, 10);
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

            // if(passwordCheck)
            // return res.status(400).json({message:"Login Successful"});

            const token = jwt.sign(
                {
                    userId: existUsername._id,
                    username: existUsername.username,
                },
                Key,
                { expiresIn: "24h" }
            );

            // console.log(userID);
            return res.status(200).send({
                message: "Login Successful...!",
                email: existUsername.email,
                username: existUsername.username,
                token: token,
            });
        });
    } else {
        return res.status(400).json({ message: "Invalid Username" });
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

        if(!req.app.locals.resetSession)
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

module.exports = {
    register,
    login,
    getuser,
    updateuser,
    generateOTP,
    verifyOTP,
    createResetSession,
    resetpassword,
    verifyUser
};
