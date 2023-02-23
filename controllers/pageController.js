const Website=require('../Models/websiteModel')
getPage = async(req, res) => {
                const id=(req.params.id);
                try{
                const userData=await Website.findById(id);
                  res.json(userData);
                }catch(err)
                {
                    res.json(err)
                }

  }
savePage=async(req,res)=>{
          const {html,css,assets}=req.body;
          
         try{
                const newData=new Website({html,css,assets});
                 const savedData=await newData.save();
                 res.send(savedData)
         }catch(err){
             res.json(err)
         }
  }

updatePage=async(req,res)=>{
    const id=req.params.id;
    const {html,css,assets}=req.body;
    console.log('updating')
    try{
            const savedData=await Website.findByIdAndUpdate(id,{html,css,assets});
            res.send(savedData)
    }catch(err){
        res.json(err)
    }
  }
  module.exports={getPage,savePage,updatePage}
