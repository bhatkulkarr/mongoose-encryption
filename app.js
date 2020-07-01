require("dotenv").config();
const bodyparser = require("body-parser");
const ejs = require("ejs");
const express = require("express");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltrounds = 10;

const app = express();

app.use(express.static("public"));
app.set("view engine", 'ejs');
app.use(bodyparser.urlencoded({extended: true}));


mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({

  email: String,
  password: String
});



const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){

  res.render("home");
});

app.get("/login", function(req, res){

  res.render("login");
});

app.get("/register", function(req, res){

  res.render("register");
});

app.post("/register", function(req, res){

bcrypt.hash(req.body.password, saltrounds, function(err, hash){
  const newUser = User({
    email: req.body.username,
    password: hash,
  });

  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }else{
      console.log(err);
    }
  });

});


});

app.post("/login", function(req, res){

  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, userfound){
    if(err){
      console.log(err);
    }else{
      if(userfound){
        bcrypt.compare(password, userfound.password, function(err, result){
            if(result === true){
              res.render("secrets");
            }else{
              console.log("Error");
            }

        });
      }
    }

  });
 });

app.listen("3000", function(req, res){

  console.log("Srver Running on Port 3000.")
});
