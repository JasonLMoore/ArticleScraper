const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

//scraping tools//
const axios = require("axios");
const cheerio = require("cheerio");

//req all models
const db = require("./models");

//PORT will need to change for Heroku//
const PORT = 3000;
//////////////////

//init Express//
const app = express();

//MIDDLEWARE CONFIG//
//morgan logger for logging requests (Taken from 18-20)//
app.use(logger("dev"));
//request body parsed as JSON//
app.use(express.urlencoded({ extended:true }));
app.use(express.json());
//make public folder static//
app.use(express.static("public"));

//connect to the Mongo db//will need to change//
mongoose.connect("mongodb://", { useNewUrlParser: true});
////////////////////////////

//ROUTES//

//GET route for scraping NBA.com website//
app.get("/scrape", function(req, res) {
  //grab html body//
  axios.get("https://www.nba.com/#/").then(function(response) {
    //load into cherrio//save to $ for shorthand//
    const $ = cheerio.load(response.data);

    //grab every a within a content_list tag//
    $("content_list a").each(function(i, element) {
      const result = {};

      //add text and href of every link, save as properties of result obj//
      result.title = $(this)
        .children("h5")
        .text();
      result.link = $(this)
        .attr("href");
      
      //create new Article using `result` object from scraping//
      db.Article.create(result)
        .then(function(dbArticle) {
          //view added result in console//
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });
    
    //send message to client//
    res.send("Scrape Complete")
  });
});

//Route for gettin all Articles from the db//
app.get("/articles", function(req, res) {
  //grab every doc in Articles collection//
  db.Article.find({})
    .then(function(dbArticle) {
      //Success//send back to client//
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//Route for grabbing specific Article by id, populate with comments//
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("comment")
    .then(function(dbArticle) {
      //Success//send back to client//
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//Route for saving/updating Article's comments//
app.post("/articles/:id", function(req, res) {
  //create new comment and pass req.body to entry//
  db.Comment.create(req.body)
    .then(function(dbComment) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbComment._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//Start the server//
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});