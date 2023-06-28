const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const https = require("https")
const path = require("path");
const fs = require("fs")

const dotenv = require("dotenv");
const planetsRouter = require("../routes/planets/planets.router")
const launchesRouter = require("../routes/launches/launches.router")

dotenv.config();
const app = express();
// parse json from the body of incomnig request
app.use(cors({
    origin: 'http://localhost:3000', 
}));

// // SSL certificate configuration
// const privateKeyPath = path.join(__dirname, "..", "ssl", "key.pem");
// const certificatePath = path.join(__dirname, "..", "ssl", "cert.pem");
// const privateKey = fs.readFileSync(privateKeyPath, "utf8");
// const certificate = fs.readFileSync(certificatePath, "utf8");
// const credentials = { key: privateKey, cert: certificate };

// // Create an HTTPS server
// const httpsServer = https.createServer(credentials, app);


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "OPTIONS, GET, POST, PUT, PATCH, DELETE" // what matters here is that OPTIONS is present
    );
    next();
  });
app.use(morgan('combined'));

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