const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = require("../server");
const  UserModel  = require("../Model/userModel");

chai.use(chaiHttp);
const { expect } = chai;
describe("register user", () => {
  let userModelStub;
  beforeEach(() => {
    userModelStub = sinon.stub(UserModel, "findOne");
  });

  afterEach(() => {
    userModelStub.restore();
  });

  it("should create a new user", async () => {
    const requestBody = {
      email: "test@gmail.com",
      username: "testuser",
      password: "testpassword",
    };
    userModelStub.resolves(null);
    const hashStub = sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
    const createStub = sinon.stub(UserModel, 'create').resolves(requestBody);
    const res = await chai
      .request(app)
      .post("/user/register")
      .send(requestBody);
    expect(res).to.have.status(201);
    expect(res.body.message).to.equal("successfully created User");
  });

  it("should return error if username or email already exists", async () => {
    const requestBody = {
      email: "test@gmail.com",
      username: "testuser",
      password: "testpassword",
    };

    userModelStub.resolves({
      username: "testuser",
    });

    const res = await chai
      .request(app)
      .post("/user/register")
      .send(requestBody);

    expect(res).to.have.status(409);
    expect(res.body.message).to.equal("username or email already exists");
  });

  it("should return error if missing required fields", async () => {
    const requestBody = {
      email: "test@gmail.com",
    };

    const res = await chai
      .request(app)
      .post("/user/register")
      .send(requestBody);

    expect(res).to.have.status(400);
    expect(res.body.error).to.equal("Please enter all values");
  });

 
});


describe('User login', () => {
  let userModelStub;

  before(() => {
    userModelStub = sinon.stub(UserModel, 'findOne');
  });

  after(() => {
    userModelStub.restore();
  });

  it('should log in a user', async () => {
    const username = 'pratik';
    const password = 'password123';

    const user = {
      _id: '1',
      username: username,
      password: await bcrypt.hash(password, 10)
    };

    userModelStub.withArgs({ username: username }).resolves(user);

    const res = await chai.request(app)
      .post('/user/login')
      .send({ username: username, password: password });

    expect(res).to.have.status(200);
    expect(res.body.username).to.equal(user.username);
  });

  it('should return an error if the username is invalid', async () => {
    const username = 'invalidusername';
    const password = 'password123';

    userModelStub.withArgs({ username: username }).resolves(null);

    const res = await chai.request(app)
      .post('/user/login')
      .send({ username: username, password: password });

    expect(res).to.have.status(400);

    expect(res.body.message).to.equal('Invalid Username');
  });

  it('should return an error if the password is incorrect', async () => {
    const username = 'pratik';
    const password = 'wrongpassword';
    const user = {
      _id: '1',
      username: username,
      password: await bcrypt.hash('password123', 10)
    };
    userModelStub.withArgs({ username: username }).resolves(user);
    const res = await chai.request(app)
      .post('/user/login')
      .send({ username: username, password: password });
    expect(res).to.have.status(400);
  });
});



// describe('logout ', ()=> {
//     it('should clear token cookie and return 200 status code', async ()=> {
//       const token = jwt.sign({ userId: 1 }, 'secret');
//       const agent = chai.request.agent(app);
//       agent.set('Cookie', `token=${token}; HttpOnly`);
//       const res = await chai.request(app).get('/user/logout');
//       expect(res).to.have.status(200);
//     });
//   });



describe('get User function', function() {
  beforeEach(function() {
    findOneStub= sinon.stub(UserModel, 'findOne');
  });
  afterEach(function() {
    UserModel.findOne.restore();
  });
  it('should return user data if user is found', async () => {
    const user = { username: 'pratik', name: 'Pratik' };
    findOneStub.resolves(user);
    const res = await chai.request(app).get('/user/user/pratik');
    expect(res).to.have.status(201);
    expect(res.body).to.deep.equal(user);
  });
});
