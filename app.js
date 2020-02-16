//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");


const homeStartingContent = "This is home page to show all the posts....";
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// const obj = {
//   content:String,
//   comment:Array
// };
const postSchema = {
  fname: String,
  lname: String,
  email: String,
  password: String,
  title: String,
  content: String,
  // post:{
  //   content:String,
  //   comment:Array
  // }
};

const Post = mongoose.model("Post", postSchema);



//let posts =[];

app.get("/", function(req, res) {
  res.render("login");
});

app.post("/", function(req, res) {
  const requestedEmail = req.params.email;
  const requestedPassword = req.params.password;

  Post.find({
    email: requestedEmail,
    password: requestedPassword
  }, function(err, post) {

    res.redirect("/home");
  });
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  const post = new Post({
    fName: req.body.fName,
    lName: req.body.lName,
    email: req.body.email,
    password: req.body.password
  });

  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });
});


app.get("/home", function(req, res) {
  Post.find({}, function(err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});


app.post("/home", function(req, res) {
  res.redirect("/home");
});



app.get("/home/compose", function(req, res) {
  res.render("compose");
});

app.post("/home/compose", function(req, res) {
  //console.log(req.body.postTitle);
  //console.log(req.body.postBody);
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err) {
    if (!err) {
      res.redirect("/home");
    }
  });
});

// app.get("/home/posts/:postId", function(req, res) {
//   //const requestedTitle=_.lowerCase(req.params.postName);
//   const requestedPostId = req.params.postId;
//
//   Post.findOne({
//     _id: requestedPostId
//   }, function(err, post) {
//
//     res.render("post", {
//       title: post.title,
//       content: post.content
//     });
//   });
// });




app.listen(3000, function() {
  console.log("Server started on port 3000...");
});
