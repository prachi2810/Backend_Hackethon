// import { Router } from "express";
const express=require("express");
const router = express.Router();
const Auth = require('../middleware/auth');
const localVeriables = require('../middleware/auth');
const registermail = require('../Controller/mailer');
const controller = require('../Controller/appController');
// import * as controller from '../Controller/appController.js';
// POST Method
router.route('/register').post(controller.register);
router.route('/registerByGoogle').post(controller.registerByGoogle);
// router.route('/registerMail').post(registermail);
router.route('/authenticate').post((req, res) => res.end());
router.route('/login').post(controller.login);
router.route('/loginByGoogle').post(controller.loginByGoogle);

// GET Method
router.route('/user/:username').get(controller.getuser);
router.route('/generateOTP').get(controller.verifyUser, localVeriables, controller.generateOTP);
router.route('/verifyOTP').get(controller.verifyOTP);
router.route('/createResetSession').get(controller.createResetSession);
router.route('/isLoggedIn').get(controller.verifyUser)
router.route('/logout').get(controller.logout)

// PUT Method
router.route('/updateuser').put(Auth, controller.updateuser);
router.route('/resetpassword').put(controller.verifyUser, controller.resetpassword);
router.route('/forgotpassword').put(controller.forgotPassword);
module.exports=router;