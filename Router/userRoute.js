// import { Router } from "express";
const express=require("express");
const router = express.Router();
const AuthFile = require('../middleware/auth');
const registermail = require('../Controller/mailer');
const controller = require('../Controller/userController');
// import * as controller from '../Controller/appController.js';
// POST Method
router.route('/register').post(controller.register);
//router.route('/registerMail').post(registermail);
//router.route('/authenticate').post((req, res) => res.end());
router.route('/login').post(controller.login);

// GET Method

router.get('/generateOTP/:username', controller.generateOTP);
router.route('/verifyOTP').get(controller.verifyOTP);
//router.route('/createResetSession').get(controller.createResetSession);
router.route('/isLoggedIn').get(controller.verifyUser)
router.route('/logout').get(controller.logout)
router.route('/user/:username').get(controller.getuser);

// PUT Method
//router.route('/updateuser').put(AuthFile.Auth, controller.updateuser);
router.route('/forgotPassword').put( controller.forgotPassword);
module.exports=router;