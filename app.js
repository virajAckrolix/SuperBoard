const express = require("express");
const config = require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const upload = require('express-fileupload')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const routes = require("./routes/index")

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => console.log(err));
let db = mongoose.connection;
db.on("error", () => {
  console.log("error");
});
db.once("open", () => {
  console.log("Connected to Atlas");
});

const port = process.env.PORT;
console.log(port);

const app = express();

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(express.json());
app.use(bodyParser.json());
//parse form/multipartform/file upload
app.use(upload())

//cors

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST , OPTIONS');
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cors())

app.use(cookieParser())

// Set Public Folder
//not needed for the project but is nice to have incase we wish to serve static files from our public folder.
app.use(express.static(path.join(__dirname, "public")));


app.use('/api/v1/' , routes)

app.listen(port, () => {
  console.log(`server listenin gon port ${port}`);
});
