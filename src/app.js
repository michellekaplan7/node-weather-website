const path = require("path");
const express = require("express");
const hbs = require("hbs");
// const { request } = require("http");
const geocode = require("./utils/geocode");
const forecase = require("./utils/forecast");
const forecast = require("./utils/forecast");

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// set a value for an express setting / use handlebars to create dynmaic templates
// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// use is a way to customize your server
// static takes the path to the folder we want to serve up
// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  // first argument name of view to render, second argument is the object which contains all of the values you want that view to be able to access
  res.render("index", {
    title: "Weather App",
    name: "Michelle Kaplan",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Michelle Kaplan",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "This is some helpful text",
    title: "Help",
    name: "Michelle Kaplan",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address!",
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }

  console.log(req.query.search);
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Michelle Kaplan",
    errorMessage: "Help article not found.",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Michelle Kaplan",
    errorMessage: "Page not found.",
  });
});

// starts up server and has it listen on a port, takes an optional callback function
app.listen(3000, () => {
  console.log("Server is up on port 3000");
});

// get takes in 2 arguments, 1st is the route (partial url) and 2nd is function (what we want to do when someone visits the route, what to send back to them)
// get lets us configure what the server should do when someone tries to get the resource at a specific URL (maybe we should be sending back HTML or JSON)

// DON'T NEED THIS ANYMORE BECAUSE IT COMES FROM STATIC DIRECTORY
// app.get("", (req, res) => {
//   // send something back to the requester
//   res.send("<h1>Weather</h1>");
// });

// app.get("/help", (req, res) => {
//   // can provide send an object or array and will automatically stringify JSON for you

//   //   res.send({
//   //     name: "Michelle",
//   //     age: 25,
//   //   });

//   res.send([
//     {
//       name: "Andrew",
//     },
//     {
//       name: "Michelle",
//     },
//   ]);
// });

// app.get("/about", (req, res) => {
//   res.send("<h1>About</h1>");
// });
