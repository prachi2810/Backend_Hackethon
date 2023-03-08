const express=require('express');
const router=express.Router();
const {getPage,savePage,updatePage} = require('../Controller/pageController');
//route for save website 
router.post('/savePage',savePage)
//route for update website
router.patch('/updatePage/:id',updatePage)
//route for get website
router.get('/getPage/:id',getPage)
module.exports=router;
