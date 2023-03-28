const Template=require('../Model/templateModel')
const mongoose=require('mongoose');
const Grid = require('gridfs-stream');
const { GridFSBucket } = require('mongodb');

const conn = mongoose.connection;
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

saveTemplate=async(req,res)=>{
  console.log('request received')
    const {html,css,assets,userId, name, tags}=req.body;
    console.log(req.body)
      const thumbnail=req.file.path;
       const newTemplate=new Template({html,css,assets,userId,thumbnail,  name,tags});
     try{
        const ans=await newTemplate.save();
        res.send(ans);
       
   }catch(err){
       res.json(err)
   }
}

getAllTemplates=async(req,res)=>{
    const allTemplate=await Template.find()
   
   const ids= await Promise.all(allTemplate.map(async(item)=>{
    const bucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });
    const image = await bucket.find({ _id: item.thumbnail }).toArray();

    const imageData = await bucket.openDownloadStream(image[0]._id).toArray();

   return {...item, thumbnail:  imageData[0].toString('base64')  }
    }))
   
   res.json(ids);
}
getPerticularTemplate=async(req,res)=>{
  try{
    const id=req.params.id;
    const template=await Template.findById(id)
    res.send(template)
  }catch(err)
  {
    res.json(err)

  }
}

updateTemplate=async(req,res)=>{
  const id=req.params.id;
  const {html,css,assets}=req.body;
  console.log('update template')
  try{
          const savedData=await Template.findByIdAndUpdate(id,{html,css,assets},{new:true});
          res.status(200).json(savedData)
  }catch(err){
      res.json(err)
  }
}
getAllTemplatesByTags = async (req, res) => {
 
  const allTemplate = await Template.find({ tags: { $in: [req.params.tags] } })
  const ids = await Promise.all(allTemplate.map(async (item) => {
    const bucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });
    const image = await bucket.find({ _id: item.thumbnail }).toArray();
    const imageData = await bucket.openDownloadStream(image[0]._id).toArray();
    return { ...item, thumbnail: imageData[0].toString('base64') }
  }))

  res.status(200).json(ids);
}

module.exports={saveTemplate,getAllTemplates,getPerticularTemplate,updateTemplate,getAllTemplatesByTags}