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
var PORT = process.env.PORT || 3000;

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

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));;
});

// Connect To The Mongo DB using Mongoose
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news-scraper";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true
});

// Start The Server
app.listen(PORT, function () {
  console.log("App Running On Port " + PORT + "!");
});