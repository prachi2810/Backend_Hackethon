// const Page=require('../Model/pageModel');
const Website = require('../Model/websiteModel');


const allPages = async (req, res) => {
  try {

    const pages = await Website.find({ userId: req.params.id });
    res.status(200).send(pages);

  }
  catch (error) {
    res.status(404).json(error);
  }
}

const deleteRecord = async (req, res) => {
  try {
    const deletedPage = await Website.findByIdAndDelete(req.params.id);
    res.send(deletedPage)
  }
  catch (error) {
    res.status(404).json(error);
  }
}


const getPage = async (req, res) => {
  const id = (req.params.id);
  try {
    const userData = await Website.findById(id);
    res.json(userData);
  } catch (err) {
    res.json(err)
  }

}
const savePage = async (req, res) => {
  const { html, css, assets, userId, name,domain,date} = req.body;
  try {
    const newData = new Website({ html, css, assets, userId,name,domain,date});
    const savedData = await newData.save();
    res.send(savedData);
    
    
  } catch (err) {
    res.json(err)
  }
}

const updatePage = async (req, res) => {
  const id = req.params.id;
  const { html, css, assets } = req.body;
  console.log('updating')
  try {
    const savedData = await Website.findByIdAndUpdate(id, { html, css, assets });
    res.send(savedData)
  } catch (err) {
    res.json(err)
  }
}
module.exports = { getPage, savePage, updatePage, allPages, deleteRecord }
