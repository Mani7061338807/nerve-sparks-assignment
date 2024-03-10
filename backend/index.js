const express = require('express');
const mongodb = require('mongodb');
const {MongoClient} = require('mongodb');

//db connection
const url = "mongodb+srv://manishankarkumar789:mani@cluster0.vgopnh9.mongodb.net/";

const client = new MongoClient(url);

const  connectDB = async () =>{
   await client.connect();
}

connectDB()
.then(()=> console.log("db connected"))
.catch(err => console.log(err));

const app = express();

app.use(express.json());


app.listen(3000, () => {
  console.log('Server started on port 3000');
});