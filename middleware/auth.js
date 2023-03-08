const jwt = require("jsonwebtoken");
const Key = process.env.USER_KEY;

async function Auth(req, res, next) {
    const token=req.cookies.token;
    try{
        if(!token){
        res.status(401).send('Access denied..');
        }
        else{
        const decoded=jwt.verify(token,Key);
        // res.send(decoded)
        res.user=decoded;
        next()
        }
    }
    catch(err){
        res.clearCookie('token');
        return res.status(400).send(err.messsage);
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
