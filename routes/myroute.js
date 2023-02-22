const express=require('express');
const multer = require('multer');
const router=express.Router();
 const {getHomePage,getData,saveData} = require('../controllers/myController');
const profileController=require('../controllers/profileController')
const upload = multer({ dest: 'uploads/' });
router.get('/',getHomePage)
router.post('/save',saveData)
router.get('/getData/:id',getData)
router.post('/profile',upload.single('file'),(req,res)=>{
    const data=req.file;
    res.send('hello')
})
module.exports=router;