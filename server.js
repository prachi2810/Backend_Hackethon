require('dotenv').config();
const userRouter=require('./Router/userRoute');
const PORT=process.env.PORT || 8000;
const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express()
const mainRoute=require('./Router/mainRoute')
const cookieParser=require('cookie-parser')

require('./db')
app.use(cors({ origin: 'http://localhost:3000',credentials:true}))
app.use(cookieParser())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json())
app.use('/',mainRoute);
app.use('/user',userRouter)
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
