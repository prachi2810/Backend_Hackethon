const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express()
const port = 8000;
const myRoutes=require('./routes/myroute')
require('./db')

app.use(cors())

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json())
app.use('/',myRoutes);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})