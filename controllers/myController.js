const { json } = require('express');
const Website=require('../schemas/Website')
getHomePage = (req, res) => {
    res.send('Hello, world!');
  };
  
getData = async(req, res) => {
                const id=(req.params.id);
                try{
                const userData=await Website.findById(id);
                  res.json(userData);
                }catch(err)
                {
                    res.json(err)
                }

  }
saveData=async(req,res)=>{
          const {html,css,assets}=req.body;
         try{
                const newData=new Website({html,css,assets});
                 const savedData=await newData.save();
                 res.send(savedData)
         }catch(err){
             res.json(err)
         }
  }

  module.exports={getHomePage,getData,saveData}
