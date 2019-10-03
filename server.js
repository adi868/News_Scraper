//Server Dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require('path');
// Scraping Tools. It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require All Models. Database Models
var db = require("./models");

// Initialize Express
var app = express();
var PORT = process.env.PORT || 8080;

// Configure Middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse Request Body as JSON
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
// Make Public A Static Folder
app.use(express.static("public"));

// Routes
// A GET route for scraping the medium website
app.get("/api/scrape", function (req, res) {
  console.log('Now Scraping')
  // First, we grab the body of the html with axios
  axios.get("https://techcrunch.com/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every article and do the following:
    $("div.post-block").each(function (i, element) {
      // Save an empty result object
      var result = {};

      result.title = $(this)
        .children("header")
        .children("h2")
        .children("a")
        .text();
      result.link = $(this)
        .children("header")
        .children("h2")
        .children("a")
        .attr("href");
      result.image = $(this)
        // .children("footer.post-block__footer")
        // // .children('img')
        // .attr('src')
        .find('img')
        .children('img')
        .attr('src')

      result.body = $(this)
        .children("div.post-block__content")
        .text();
      console.log(result);

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log("Inside")
          console.log(dbArticle, "DB Article");
        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.get("/api/saved-articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({saved: true})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.post("/api/save/:id", function(req,res){
  db.Article.update({_id: req.params.id}, {$set: {saved: true}}, (err, result) => {
    if (err) {
        console.log("Save Failed!");
        console.log(err);
    }
    res.json(result)
});
});

app.post("/api/unsave/:id", function(req,res){
  db.Article.update({_id: req.params.id}, {$set: {saved: false}}, (err, result) => {
    if (err) {
        console.log("Unsave Failed!");
        console.log(err);
    }
    res.json(result)
});
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/api/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({
      _id: req.params.id
    })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({
        _id: req.params.id
      }, {
        note: dbNote._id
      }, {
        new: true
      });
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.get("/api/delete", function(req,res){
  db.Article.deleteMany()
  .then(function(){
    res.send("Delete Success!")
  })
});

app.get("/api/notes/:id", function(req,res){
  db.Note.deleteOne({ _id: req.params.id })
  .then(function(){
    res.send("Delete Success!")
  })
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/assets/views/index.html'));;
});

app.get('/saved',function(req,res) {
  res.sendFile(path.join(__dirname+'/public/assets/views/saved.html'));;
});

// Render 404 page for any unmatched routes
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname + '/public/assets/views/404.html'));;
});

// Connect To The Mongo DB using Mongoose
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://Adina:password1@ds115045.mlab.com:15045/heroku_p59bbc54";
//var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true
});

// Start The Server
app.listen(PORT, function () {
  console.log("App Running On Port " + PORT + "!");
});