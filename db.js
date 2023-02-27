const mongoose = require('mongoose');
mongoose.set('strictQuery', false)
const dbUrl='mongodb+srv://pratik:pratik@buildmateforhackthon.zpbhh8r.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dbUrl, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));