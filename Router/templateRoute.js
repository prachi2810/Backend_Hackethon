const express=require('express');
const router=express.Router();
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');

const Template=require('../Model/templateModel')
const {saveTemplate,getAllTemplates,getPerticularTemplate} =require ('../Controller/templateController.js')
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
    const {html,css,assets,userId,   name, domain}=req.body;
      const thumbnail=req.file.id;
      console.log(thumbnail)
       const newTemplate=new Template({html,css,assets,userId,thumbnail,   name, domain});
     try{
        const ans=await newTemplate.save();
        res.send(ans);
        
   }catch(err){
       res.json(err)
   }
})
router.get('/',getAllTemplates)

router.get('/getTemplate/:id',getPerticularTemplate)

module.exports=router;