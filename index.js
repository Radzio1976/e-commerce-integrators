const express = require("express");
const fs = require("fs");
const path = require("path");
var parseString = require("xml2js").parseString;
const { toXML } = require("jstoxml");
require("dotenv").config();
const axios = require("axios");
var cors = require("cors");
const bodyParser = require("body-parser");
const ProgressBar = require("progress");
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 3001;
const uri = process.env.MONGODB_URI;

const addUser = require("./httpRequests/addUser");
const login = require("./httpRequests/login");
const usersIntegrators = require("./httpRequests/usersIntegrators");
const addAmpApi = require("./httpRequests/addAmpApi");
const getAmpApi = require("./httpRequests/getAmpApi");
const downloadFile = require("./utils/downloadFile");
const shopGoldAmpPolskaProducts = require("./xmlIntegrators/shopGoldAmpPolska/shopGoldAmpPolskaProducts");

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./client/build", "index.html"),
    function (err) {
      if (err) {
        res.status(500), send(err);
      }
    }
  );
});

const client = new MongoClient(uri);

async function mongoDBConnection() {
  try {
    //Connect to the MongoDB cluster
    client.connect();
    console.log("Connected with MongoDB");
  } catch (error) {
    console.log("Not connected with MongoDB", error);
  }
}
mongoDBConnection();

const usersdb = client.db("e-commerce-integrators").collection("users");
const ampPolska = client.db("e-commerce-integrators").collection("ampPolska");
const fhSahs = client.db("e-commerce-integrators").collection("fhSahs");

app.post("/addUser", (req, res) => {
  addUser(req, res, usersdb);
});

app.post("/login", (req, res) => {
  login(req, res, usersdb);
});

app.post("/users-integrators", (req, res) => {
  usersIntegrators(req, res, usersdb, ampPolska, fhSahs);
});

app.post("/shopGold-ampPolska", (req, res) => {
  const data = req.body;
  usersdb
    .find({
      email: data.currentUser,
    })
    .toArray((error, result) => {
      if (error) {
        res.send("Nie udało się znależć użytkownika");
        console.log("Nie udało się znależć użytkownika", error);
      } else {
        if (result.length === 1) {
          if (data.action === "addAmpApi") {
            addAmpApi(req, res, ampPolska, data, result);
          }
          if (data.action === "getAmpApi") {
            getAmpApi(res, ampPolska, result);
          }
        }
      }
    });
});

app.listen(port, () =>
  console.log(`Serwer nasłuchuje na porcie: http://localhost:${port}`)
);
