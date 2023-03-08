
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
    const {html,css,assets,userId,   name, domain}=req.body;
      const thumbnail=req.file.path;
       const newTemplate=new Template({html,css,assets,userId,thumbnail,   name, domain});
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

module.exports={saveTemplate,getAllTemplates,getPerticularTemplate}
