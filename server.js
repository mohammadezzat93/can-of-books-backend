'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const server = express();
server.use(cors());


// access req.body
server.use(express.json());

const PORT = process.env.PORT ;

const mongoose = require('mongoose');

main().catch(err => console.log(err));

let BookModel;
async function main() {
  // await mongoose.connect('mongodb://localhost:27017/Book'); // test : Database Name
  await mongoose.connect(process.env.MONGO_URL);


const BookSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
  email: String,
  img:String,
});

 BookModel = mongoose.model('book', BookSchema);

// seedData();

  }

 async function seedData(){
    // Seeding a data
const BookData1 = new BookModel({
  title: 'Java Script',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id arcu sit amet elit tempor aliquet id nec libero. Morbi vitae laoreet nisi, et tempus dui.',
  status: 'valid',
  email: 'mohammadd9391@gmail.com',
  img:'https://abuelfateh.com/imgs/b/intro_js.jpg',
   });

   const BookData2 = new BookModel({
    title: 'React JS',
    description: ' Praesent scelerisque metus felis, in volutpat felis maximus vel. Etiam porttitor fermentum leo eget malesuada. Vestibulum lacinia,',
    status: 'Not valid',
    email: 'mohammadd9391@gmail.com',
    img:'https://ms314006.github.io/static/b7a8f321b0bbc07ca9b9d22a7a505ed5/97b31/React.jpg',
     });

     const BookData3 = new BookModel({
      title: 'No SQL',
      description: 'nibh nec porttitor finibus, magna odio vestibulum dolor, ac pellentesque justo augue sed erat. Fusce et eros ligula. Pellentesque in eros vel enim condimentum lacinia.',
      status: 'valid',
      email: 'mohammadd9391@gmail.com',
      img:'https://miro.medium.com/max/5280/1*o2IgqXaoE90j8ZtoXPodjA.png',
       });

       // Save
   await BookData1.save();
   await BookData2.save();
   await BookData3.save();
  }
  
  // Routes
  server.get('/', getPageHome);
  server.get('/getBooks', getBookHandeler);
  server.post('/addBooks', addBookHandeler);
  server.delete('/deleteBooks/:id', deleteBookHandeler);

  // Function Handeler

  // http://localhost:3010/
  function getPageHome(req,res){
    res.send('Welcome ');
  }

  // http://localhost:3010/getBooks?email=mohammadd9391@gmail.com
  function getBookHandeler(req,res){
    const email = req.query.email;
    BookModel.find( {email:email} , (err,result) =>{
      if (err){
      console.log('Error !');
      }
      else{
      console.log(result);
      res.send(result);
      }
    })
  }

  // http://localhost:3010/addBooks
  async function addBookHandeler(req,res){
    console.log(req.body);
    // const bookName = req.body.bookName;
    // const email = req.body.email;
    const{bookName,description,status,email} = req.body ;
    await BookModel.create({
      title: bookName,
      description : description,
      status: status,
      email: email,
      });
      BookModel.find( {email:email} , (err,result) =>{
        if (err){
        console.log('Error !');
        }
        else{
        res.send(result);
        }
      })
  }

  // http://localhost:3010/deleteBooks
  async function deleteBookHandeler(req,res){
    const bookId = req.params.id;
    const email = req.query.email;
    await BookModel.deleteOne( {_id:bookId} , (err,result) =>{ // we can use *remove* but to prevent depreceted we use *deleteOne*
       BookModel.find( {email:email} , (err,result) =>{
        if (err){
        console.log('Error !');
        }
        else{
        console.log(result);
        res.send(result);
        }
      })
    })
  }

server.listen(PORT, () => console.log(`listening on ${PORT}`));
