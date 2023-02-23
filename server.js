const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express()
const port = 8000;
const mainRoute=require('./routes/mainRoute')
require('./db')
app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json())
app.use('/',mainRoute);
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})