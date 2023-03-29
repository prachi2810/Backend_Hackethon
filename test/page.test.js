const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server'); 
const websiteModel = require('../Model/websiteModel'); 

chai.use(chaiHttp);
const expect = chai.expect;
const website = {
  "_id": "640b103f67124fa43d5bb8cd",
  "html": "<body><div></div><div class=\"gjs-row\"><div class=\"gjs-cell\"></div></div></body>",
  "css": [
      {
          "selectors": [
              {
                  "name": "gjs-row",
              }
          ],
          "style": {
              "display": "table",
          }
      }
  ],
  "name": "Pratik",
  "assets": [],
  "userId": "63f88404d659351465c520b1",
  "__v": 0
};
describe('get website by Id', () => {
  it('should return the website with the given id', async() => {
    const findByIdStub = sinon.stub(websiteModel, 'findById').resolves(website);
    const id='640b103f67124fa43d5bb8cd'
    const res=await chai.request(app)
      .get(`/page/getPage/${id}`)
    expect(res).to.have.status(200);
    expect(res.body).to.deep.equal(website);
  
  });
});
describe('Post website',()=>{
     it('should add new website succesfully ',async()=>{
      const reqBody = {
        html:website.html,
        css:website.css,
        assets:website.assets,
        userId:website.userId,
        name:website.name

      };
      const savedWebsite = new websiteModel({html:reqBody.html,css: reqBody.css,assets: reqBody.assets,userId:reqBody.userId,name:reqBody.name});
      sinon.stub(websiteModel.prototype, 'save').resolves(savedWebsite);
      const res = await chai.request(app)
        .post('/page/savePage')
        .send(reqBody);
        res.body.userId = new mongoose.Types.ObjectId(res.body.userId);
        res.body._id = new mongoose.Types.ObjectId(res.body._id);
      expect(res.status).to.equal(201);
      expect(JSON.stringify(res.body)).to.deep.equal(JSON.stringify(savedWebsite));
      
     })
})



  describe('update website', ()=> {
    it('should update website data', async()=> {
      const updatedWebsite={...website,__v:1}
      sinon.stub(websiteModel, 'findByIdAndUpdate').resolves(updatedWebsite);
       const res=await chai.request(app)
        .patch('/page/updatePage/640b103f67124fa43d5bb8cd')
        .send({html:website.html,css:website.css,assets:website.assets })
        expect(res).to.have.status(200);
  expect(res.body).to.be.an('object');
  expect(res.body).to.deep.equal(updatedWebsite);
         });
    });

  
  

afterEach(() => {
  sinon.restore();
});