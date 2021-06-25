const express = require("express");
const router = express.Router();

const PostModel = require("../models/post");


router.post("", (req, res, next) => {
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

router.put("/:id", (req, res, next) => {
  const post = new PostModel({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  })
  PostModel.updateOne( {_id: req.params.id} ,post)
    .then(result => {
      res.status(200).json({massage: "Update Successfully"});
    })
});

router.get("/:id", (req, res, next) => {
  PostModel.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({message: "Post not found!"});
      };
    })
    .catch(error => {
      console.log(error + " Occurred !!!")
    });
});

router.get("", (req, res, next) => {
  PostModel.find()
    .then(documents => {
      res.status(200).json({
        message: "Post Fetched Successfully",
        posts: documents
      })
    })
});

router.delete("/:id", (req, res, next) => {
  console.log(req.params.id);
  PostModel.deleteOne({
    _id: req.params.id
  })
    .then(result => {
      console.log(result);
      res.status(200).json({message: "Post Deleted"});
    })
});


module.exports = router;
