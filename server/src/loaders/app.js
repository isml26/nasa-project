const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");


const dotenv = require("dotenv");
const planetsRouter = require("../routes/planets/planets.router")
const launchesRouter = require("../routes/launches/launches.router")
const {logStream} = require("../services/logstash")

dotenv.config();
const app = express();
// parse json from the body of incomnig request
app.use(cors({
    origin: 'http://localhost:3000', 
}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "OPTIONS, GET, POST, PUT, PATCH, DELETE" // what matters here is that OPTIONS is present
    );
    next();
  });


// create a write stream (in append mode)

 
// setup the logger
// Create an array to store the logs
let logsArray = [];


// Create a stream object with a 'write' function
// let logStream = {
//   write: function(message, encoding){
//     logsArray.push(message);
//   }
// };

// Use the stream in morgan middleware
app.use(morgan(function(tokens,req,res){

  // const logObject = {
  //   method: tokens.method(req, res),
  //   url: tokens.url(req, res),
  //   status: tokens.status(req, res),
  //   contentLength: tokens.res(req, res, 'content-length'),
  //   responseTime: `${tokens['response-time'](req, res)}ms`,
  // };

  const logObject2 = 
    tokens.method(req, res)+";"+
    tokens.url(req, res)+";"+
    tokens.status(req, res)+";"+
    // tokens.res(req, res, 'content-length')+";"+
    `${tokens['response-time'](req, res)}ms`
  // Convert the JSON object to a string and log it to the console
  // console.log(JSON.stringify(logObject));
    console.log(logObject2);

    logStream.sendItToLogstash(logObject2)
}));


app.use(express.json());
app.use(express.static(path.join(__dirname,'..','..','public')));

app.get('/version', (req, res) => {
  console.log('version2'); // Log 'version2' to the console
  res.send('version2'); // Send 'version2' as the response to the browser
});


app.use("/planets",planetsRouter);
app.use("/launches",launchesRouter);

// when of there paths don't match above any of our router 
// if passes it on to react app at index.html so frontend can handle routing 

app.get('/*',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','..','public','index.html'));
});


module.exports = app;