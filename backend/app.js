const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PostModel = require("./models/post");
const mongoose = require("mongoose");


// uri with latest version of nodejs not works got error
// Error: querySrv ECONNREFUSED _mongodb._tcp.cluster0.vrf67.mongodb.net
// at QueryReqWrap.onresolve [as oncomplete] (node:dns:209:19)
// const uri = "mongodb+srv://richi:EH6yVSPXehakVA66@cluster0.vrf67.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

// uri with nodejs version 2.2.12 -> works!
const uri = "mongodb://richi:<password>@cluster0-shard-00-00.vrf67.mongodb.net:27017,cluster0-shard-00-01.vrf67.mongodb.net:27017,cluster0-shard-00-02.vrf67.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-289q1s-shard-0&authSource=admin&retryWrites=true&w=majority"

mongoose.connect(
  uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((data) => {
    console.log("Connected to mongodb")
  })
  .catch(error => {
    console.log(error.stack)
  });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
    );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS");
  next();
})

app.post("/api/posts", (req, res, next) => {
  const post = new PostModel({
    title: req.body.title,
    content: req.body.content
  });
  post.save()
    .then(createdPost => {
      res.status(201).json({
        message: "Post Added Successfully!",
        postId: createdPost._id
      });
    })
    .catch(err => {
      console.log(err)
    });
});

app.get("/api/posts", (req, res, next) => {
  PostModel.find()
    .then(documents => {
      res.status(200).json({
      message: "Post Fetched Successfully",
      posts: documents
      })
    })
});

app.delete("/api/posts/:id", (req, res, next) => {
  console.log(req.params.id);
  PostModel.deleteOne({
    _id: req.params.id
  })
    .then(result => {
      console.log(result);
      res.status(200).json({message: "Post Deleted"});
    })
});

module.exports = app;


