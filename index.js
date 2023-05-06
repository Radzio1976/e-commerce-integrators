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
const getProductsFile = require("./httpRequests/getProductsFile");
const getUpdateFile = require("./httpRequests/getUpdateFile");
const getPricesFile = require("./httpRequests/getPricesFile");
const shopGoldAmpPolskaProducts = require("./xmlIntegrators/shopGoldAmpPolska/shopGoldAmpPolskaProducts");
const shopGoldAmpPolskaUpdate = require("./xmlIntegrators/shopGoldAmpPolska/shopGoldAmpPolskaUpdate");
const shopGoldAmpPolskaPrices = require("./xmlIntegrators/shopGoldAmpPolska/shopGoldAmpPolskaPrices");
const shopGoldFHSahsProducts = require("./xmlIntegrators/shopGoldFHSahs/shopGoldFHSahsProducts");
const shopGoldFHSahsUpdate = require("./xmlIntegrators/shopGoldFHSahs/shopGoldFHSahsUpdate");
const shopGoldFHSahsPrices = require("./xmlIntegrators/shopGoldFHSahs/shopGoldFHSahsPrices");
const shopGoldKellysProducts = require("./xmlIntegrators/shopGoldKellys/shopGoldKellysProducts");
const shopGoldKellysUpdate = require("./xmlIntegrators/shopGoldKellys/shopGoldKellysUpdate");
const shopGoldKellysPrices = require("./xmlIntegrators/shopGoldKellys/shopGoldKellysPrices");

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
const kellys = client.db("e-commerce-integrators").collection("kellys");

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
            getProductsFile(
              res,
              ampPolska,
              result,
              "ampproducts",
              shopGoldAmpPolskaProducts
            );
          }

          if (data.action === "getAMPUpdateFile") {
            getUpdateFile(
              res,
              ampPolska,
              result,
              "ampupdate",
              shopGoldAmpPolskaUpdate
            );
          }

          if (data.action === "getAMPPricesFile") {
            getPricesFile(
              res,
              ampPolska,
              result,
              "ampprices",
              shopGoldAmpPolskaPrices
            );
          }
        }
      }
    });
});

app.post("/shopGold-fhSahs", (req, res) => {
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
          if (data.action === "addFHSahsApi") {
            addApi(req, res, fhSahs, data, result);
          }
          if (data.action === "changeFHSahsApi") {
            changeApi(req, res, fhSahs, data, result);
          }
          if (data.action === "getFHSahsApi") {
            getApi(res, fhSahs, result);
          }
          if (data.action === "getFHSahsProductsFile") {
            getProductsFile(
              res,
              fhSahs,
              result,
              "fhsahsproducts",
              shopGoldFHSahsProducts
            );
          }
          if (data.action === "getFHSahsUpdateFile") {
            getUpdateFile(
              res,
              fhSahs,
              result,
              "fhsahsupdate",
              shopGoldFHSahsUpdate
            );
          }
          if (data.action === "getFHSahsPricesFile") {
            getPricesFile(
              res,
              fhSahs,
              result,
              "fhsahsprices",
              shopGoldFHSahsPrices
            );
          }
        }
      }
    });
});

app.post("/shopGold-kellys", (req, res) => {
  const data = req.body;

  usersdb.find({ email: data.currentUser }).toArray((error, result) => {
    if (error) {
      res.send("Nie udało się znależć użytkownika");
      console.log("Nie udało się znależć użytkownika", error);
    } else {
      if (result.length === 1) {
        if (data.action === "addKellysApi") {
          addApi(req, res, kellys, data, result);
        }
        if (data.action === "changeKellysApi") {
          changeApi(req, res, kellys, data, result);
        }
        if (data.action === "getKellysApi") {
          getApi(res, kellys, result);
        }
        if (data.action === "getKellysProductsFile") {
          getProductsFile(
            res,
            kellys,
            result,
            "kellysproducts",
            shopGoldKellysProducts
          );
        }
        if (data.action === "getKellysUpdateFile") {
          getUpdateFile(
            res,
            kellys,
            result,
            "kellysupdate",
            shopGoldKellysUpdate
          );
        }
        if (data.action === "getKellysPricesFile") {
          getPricesFile(
            res,
            kellys,
            result,
            "kellysprices",
            shopGoldKellysPrices
          );
        }
      }
    }
  });
});

app.listen(port, () =>
  console.log(`Serwer nasłuchuje na porcie: http://localhost:${port}`)
);
