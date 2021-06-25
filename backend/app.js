const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");

// uri with latest version of nodejs not works got error
// Error: querySrv ECONNREFUSED _mongodb._tcp.cluster0.vrf67.mongodb.net
// at QueryReqWrap.on resolve [as oncomplete] (node:dns:209:19)
// const uri = "mongodb+srv://richi:<password>@cluster0.vrf67.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

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
    "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
})

app.use("/api/posts", postsRoutes);

module.exports = app;
