const jwt = require("jsonwebtoken");
const Key = process.env.USER_KEY;

async function Auth(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = await jwt.verify(token, Key);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({ error: "Auth failed1" });
    }
}

async function localVeriables(req, res, next) {
    req.app.locals = {
        OTP: null,
        resetSession: false,
    };
    next();
}

module.exports = Auth, localVeriables;
