const express=require('express');
const router=express.Router();
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const {getAllTemplates,getPerticularTemplate,updateTemplate,getUnapprovedTemplates,approveTemplate} =require ('../Controller/templateController.js')
const Template=require('../Model/templateModel')
const dbUrl='mongodb+srv://pratik:pratik@buildmateforhackthon.zpbhh8r.mongodb.net/?retryWrites=true&w=majority';

const storage = new GridFsStorage({
    url: dbUrl,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
      return {
        bucketName: 'uploads',
        filename: new Date().toISOString() + '-' + file.originalname
      };
    }
  });
const upload = multer({ storage: storage });
router.post('/saveTemplate',upload.single('thumbnail'),async(req,res)=>{
  const isApproved=false;
  const status="public";
    const {html,css,assets,userId, name, tags}=req.body;
       const thumbnail=req.file.id;
       const newTemplate=new Template({html,css:JSON.parse(css),assets,userId,thumbnail, name,tags,isApproved,status});
     try{
        const result=await newTemplate.save();
        res.status(201).send(result);
   }catch(err){
       res.json(err)
   }
})
router.get('/',getAllTemplates)
router.get('/unApproved',getUnapprovedTemplates)
router.patch('/approve/:id',approveTemplate)

router.get('/getTemplate/:id',getPerticularTemplate)
router.patch('/updateTemplate/:id',updateTemplate)
module.exports=router;