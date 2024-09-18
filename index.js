//process.loadEnvFile()
//  /$$    /$$  /$$$$$$  /$$   /$$ /$$     /$$ /$$$$$$
// | $$   | $$ /$$__  $$| $$$ | $$|  $$   /$$//$$__  $$
// | $$   | $$| $$  \ $$| $$$$| $$ \  $$ /$$/| $$  \ $$
// |  $$ / $$/| $$$$$$$$| $$ $$ $$  \  $$$$/ | $$$$$$$$
//  \  $$ $$/ | $$__  $$| $$  $$$$   \  $$/  | $$__  $$
//   \  $$$/  | $$  | $$| $$\  $$$    | $$   | $$  | $$
//    \  $/   | $$  | $$| $$ \  $$    | $$   | $$  | $$
//     \_/    |__/  |__/|__/  \__/    |__/   |__/  |__/

require("dotenv/config.js")
const express = require("express");
const cors = require("cors");
const user = require("./routes/users");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const port = process.env.PORT || 4000;
console.log("port >>>>>>>>>>>", port)

const calculator = require("./routes/calculator");
const projects = require("./routes/project");
const cartAndCheckout = require("./routes/cart_and_checkout");
const projectContractRoutes = require("./routes/projectContract.routes.js");
const storageContractRoutes = require("./routes/storageContract.routes.js");
const projectRoutes = require("./routes/project.routes.js");

const app = express();
var fs = require("fs");

app.use(cors());
global.__basedir = __dirname;

app.use(bodyParser.json());
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 1000000 })
);


app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));

// app.use(express.static(__dirname + '/public'));
app.use(express.static("public"));

//app.use('/projects/',projects)
//app.use('/user/',user);
//app.use('/calculator/',calculator);
//app.use('/cart_and_checkout/',cartAndCheckout);

app.use("/projects", projects);
app.use("/", user);
app.use("/", calculator);
app.use("/", cartAndCheckout);

app.use("/api/v1/projectContract/", projectContractRoutes);
app.use("/api/v1/storageContract/", storageContractRoutes);
app.use("/api/v1/project/", projectRoutes);

app.get("/", (req, res) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*",
    "http://3.106.24.220:4000",
    { reconnect: true }
  );
  res.header("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Accept, X-Custom-Header,Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  } else {
    return res.sendFile(__dirname + "/controller/view/welcome.html");
  }
});

app.listen(port,function () {
  console.log(`Node app is running on port ${port}`);
});
module.exports = app;
