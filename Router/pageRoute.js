const express=require('express');
const router=express.Router();
const {getPage,savePage,updatePage,allPages,deleteRecord} = require('../Controller/pageController');
const Auth=require('../middleware/auth');
//route for save website 
router.post('/savePage',savePage)
//route for update website
router.patch('/updatePage/:id',updatePage)
//route for get website
router.get('/getPage/:id',getPage);
//create Page
// router.post('createPage/:id',Auth,createPage);
router.get('/allPages/:id',allPages);
//delete Page
router.delete('/deletePage/:id',deleteRecord);
module.exports=router;
