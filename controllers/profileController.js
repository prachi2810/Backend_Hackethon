const Image=require('../schemas/profileSchema');

exports.setProfile=async(req,res)=>{
   const data=req.file;
   console.log(data);
   res.send('hello world');
}