const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

const planetsRouter = require("../routes/planets/planets.router")
const launchesRouter = require("../routes/launches/launches.router")

const app = express();
// parse json from the body of incomnig request
app.use(cors({
    origin: 'http://localhost:3000',
}));

//app.use(morgan('combined'));

app.use(express.json());
// app.use(express.static(path.join(__dirname,'..','..','public')));

app.use("/planets",planetsRouter);
app.use("/launches",launchesRouter);
// when of there paths don't match above any of our router 
// if passes it on to react app at index.html so frontend can handle routing 

// app.get('/*',(req,res)=>{
//     res.sendFile(path.join(__dirname,'..','..','public','index.html'));
// });
module.exports = app;