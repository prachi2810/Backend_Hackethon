const Page=require('../Model/pageModel');

const createPage=async(req,res)=>{
    try{
    const slug = req.name.toLowerCase().split(' ').join('-');
    res.slug = slug;
    const page=new Page(req.body);

    await page.save();

    res.status(201).json({message:"Page Created Successfully"});
    }
    catch(error){
        res.status(404).json(error)
    }

}

const allPages=async(req,res)=>{
    try{
       const pages=await Page.find();

       res.status(200).json({message:"All Pages"},pages);

    }
    catch(error){
        res.status(404).json(error);
    }
}

const findPage=async(req,res)=>{
    try{
        const page=await Page.findById(req.params.id);

        res.status(200).json(`Page by ${id}`,page);

    }
    catch(error){
       res.status(404).json(error);
    }
}

const updateRecord=async(req,res)=>{
    try{
       const updatePage=await Page.findById(req.params.id);
       const updatePageRecord=new Page(req.body)
       res.status(404).json({message:"updated Page"},updatePageRecord);

    }
    catch(error){
       res.status(404).send(error);
    }
}

const deleteRecord=async(req,res)=>{
    try{
        const deletePage=await Page.findById(req.params.id);

        await res.deletePage.remove();
        
        res.status(200).json({message:"deleted successfully"})

    }
    catch(error){
        res.status.json(error);
    }
}

