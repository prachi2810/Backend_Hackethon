const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const mocha = require('mocha');
const app = require('../server'); 
const templateModel = require('../Model/templateModel'); 
const GridFSBucket = require('mongodb').GridFSBucket;

chai.use(chaiHttp);
const expect = chai.expect;
const template = {
  "_id": "64119567b2b2a162f53344d0",
  "html": "<body><div></div><div id=\"ismf\">save template</div></body>",
  "css": [
      {
          "selectors": [
              "#ismf"
          ],
          "style": {
              "padding": "10px"
          }
      }
  ],
  "assets": [
      ""
  ],
  "tags": [
      "edit"
  ],
  "userId": "63f88404d659351465c520b1",
  "thumbnail": "64119566b2b2a162f53344ce",
  "name": "edit",
  "__v": 0
};

describe('get template by Id', () => {
  it('should return the template with the given id', async() => {
  const findByIdStub = sinon.stub(templateModel, 'findById').resolves(template);
   const res=await chai.request(app).get(`/templates/getTemplate/64119567b2b2a162f53344d0`)
   expect(res).to.have.status(200);
   expect(res.body).to.deep.equal(template);
  });
});

describe('Post template',()=>{
     it('should add new template succesfully ',async function(){
      this.timeout(5000)
      const savedTemplate = new templateModel({html:template.html,css: template.css,assets: template.assets,userId:template.userId,name:template.name,tags:template.tags,thumbnail:'64119566b2b2a162f53344ce'});
      sinon.stub(templateModel.prototype, 'save').resolves(savedTemplate);
      const res = await chai.request(app)
      .post('/templates/saveTemplate')
      .set('Content-Type', 'multipart/form-data')
      .field('html', template.html)
      .field('assets', template.assets)
      .field('userId', template.userId)
      .field('name', template.name)
      .field('tags', template.tags)
      .field('css', JSON.stringify(template.css))
      .attach('thumbnail', './favicon.png');
        res.body.userId = new mongoose.Types.ObjectId(res.body.userId);
        res.body._id = new mongoose.Types.ObjectId(res.body._id);
      expect(res.status).to.equal(201);
      expect(JSON.stringify(res.body)).to.deep.equal(JSON.stringify(savedTemplate));
     })
})
  describe('update template', ()=> {
    it('should update template data', async()=> {
      const updatedTemplate={...template,__v:1}
      sinon.stub(templateModel, 'findByIdAndUpdate').resolves(updatedTemplate);
       const res=await chai.request(app)
        .patch('/templates/updateTemplate/64119567b2b2a162f53344d0')
        .send({html:template.html,css:template.css,assets:template.assets })
        expect(res).to.have.status(200);
  expect(res.body).to.be.an('object');
  expect(res.body).to.deep.equal(updatedTemplate);
         });
    });

afterEach(() => {
  sinon.restore();
});