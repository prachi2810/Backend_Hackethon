require('dotenv').config();
const express=require('express');
const router=require('./Router/pageRoute');
const mongoose=require('mongoose');

const app=express();
app.use(express.json());

const PORT=process.env.PORT || 9101;

const mongoUri='mongodb://localhost:27017/webpage_builder';

mongoose.set('strictQuery', false);
mongoose.connect(mongoUri,{useNewUrlParser: true})

mongoose.connection.on('open',()=>{
   console.log("Connected to local Database...");
})

app.use('/api',router)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

