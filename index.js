const express = require("express");
const fs = require("fs");
const path = require("path");
var parseString = require("xml2js").parseString;
const { toXML } = require("jstoxml");
require("dotenv").config();
var cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 3001;
const uri = process.env.MONGODB_URI;

const addUser = require("./httpRequests/addUser");
const login = require("./httpRequests/login");
const addApi = require("./httpRequests/addApi");
const getApi = require("./httpRequests/getApi");
const changeApi = require("./httpRequests/changeApi");
const downloadFile = require("./utils/downloadFile");
const shopGoldAmpPolskaProducts = require("./xmlIntegrators/shopGoldAmpPolska/shopGoldAmpPolskaProducts");
const shopGoldAmpPolskaUpdate = require("./xmlIntegrators/shopGoldAmpPolska/shopGoldAmpPolskaUpdate");
const shopGoldAmpPolskaPrices = require("./xmlIntegrators/shopGoldAmpPolska/shopGoldAmpPolskaPrices");

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
            addApi(req, res, ampPolska, data, result);
          }
          if (data.action === "changeAmpApi") {
            //const data = req.body;
            changeApi(req, res, ampPolska, data, result);
          }
          if (data.action === "getAmpApi") {
            getApi(res, ampPolska, result);
          }
          if (data.action === "getAMPProductsFile") {
            ampPolska
              .find({
                userID: result[0]._id,
              })
              .toArray((error, result) => {
                if (error) {
                  res.send("Nie udało się pobrać informacji z bazy danych");
                  console.log(
                    "Nie udało się pobrać informacji z bazy danych",
                    error
                  );
                } else {
                  if (result.length === 0) {
                    res.send(
                      "Ten użytkownik nie ma dodanych adresów API Shopgold AMP Polska"
                    );
                    console.log(
                      "Ten użytkownik nie ma dodanych adresów API Shopgold AMP Polska"
                    );
                  }
                  if (result.length === 1) {
                    const urlResult = result[0].productsApi;
                    const userIdResult = result[0].userID;
                    const inputFileName = "ampproducts.xml";
                    downloadFile(
                      urlResult,
                      userIdResult,
                      shopGoldAmpPolskaProducts,
                      inputFileName
                    );
                  }
                }
              });
          }

          if (data.action === "getAMPUpdateFile") {
            ampPolska
              .find({ userID: result[0]._id })
              .toArray((error, result) => {
                if (error) {
                  res.send("Nie udało się pobrać informacji z bazy danych");
                  console.log(
                    "Nie udało się pobrać informacji z bazy danych",
                    error
                  );
                } else {
                  if (result.length === 0) {
                    res.send(
                      "Ten użytkownik nie ma dodanych adresów API Shopgold AMP Polska"
                    );
                    console.log(
                      "Ten użytkownik nie ma dodanych adresów API Shopgold AMP Polska"
                    );
                  }
                  if (result.length === 1) {
                    res.send(
                      "Ten użytkownik ma dodane adresy API Shopgold AMP Polska"
                    );
                    const urlResult = result[0].qtyApi;
                    const userIdResult = result[0].userID;
                    const inputFileName = "ampupdate.xml";
                    downloadFile(
                      urlResult,
                      userIdResult,
                      shopGoldAmpPolskaUpdate,
                      inputFileName
                    );
                  }
                }
              });
          }

          if (data.action === "getAMPPricesFile") {
            ampPolska
              .find({ userID: result[0]._id })
              .toArray((error, result) => {
                if (error) {
                  console.log(
                    "Nie udało się pobrać informacji z bazy danych",
                    error
                  );
                } else {
                  if (result.length === 0) {
                    res.send(
                      "Ten użytkownik nie ma dodanych adresów API Shopgold AMP Polska"
                    );
                    console.log(
                      "Ten użytkownik nie ma dodanych adresów API Shopgold AMP Polska"
                    );
                  }
                  if (result.length === 1) {
                    const urlResult = result[0].productsApi;
                    const userIdResult = result[0].userID;
                    const inputFileName = "ampproducts.xml";
                    downloadFile(
                      urlResult,
                      userIdResult,
                      shopGoldAmpPolskaPrices,
                      inputFileName
                    );
                  }
                }
              });
          }
        }
      }
    });
});

app.listen(port, () =>
  console.log(`Serwer nasłuchuje na porcie: http://localhost:${port}`)
);
