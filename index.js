const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const axios = require('axios');
var cors = require('cors');
const bodyParser = require("body-parser");
const port = process.env.PORT || 8080;



const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, "./client/build")));

const mongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
const dbname = 'e-commerce-integrators';

mongoClient.connect(url, {}, (error, client) => {
  if (error) {
    console.log("Nie można połączyć się z bazą danych")
  } else {
    const db = client.db(dbname)

    app.post('/addUser', (req, res) => {
      const user = req.body;

      db.collection('users').find({
        email: user.email
      }).toArray((error, results) => {
        if (error) {
          res.send({ addUser: "error", info: "Nie udało się pobrać danych na temat tego użytkownika" })
          console.log("Nie udało się pobrać danych na temat tego użytkownika")
        } else {
          if (results.length === 0) {
            db.collection('users').insertOne({
              company: user.company,
              nip: user.nip,
              name: user.name,
              surname: user.surname,
              email: user.email,
              password: user.password
            }, (error, result) => {
              if (error) {
                res.send({ addUser: "error", info: "Nie udało się dodać użytkownika" });
                console.log("Nie udało się dodać użytkownika", error)
              } else {
                res.send({ addUser: true, info: "Rejestracja przebiegła pomyślnie" });
                console.log(result.ops)
              }
            })
          } else {
            res.send({ addUser: false, info: "Użytkownik o podanym adresie e-mail już istnieje w naszej bazie danych" });
            console.log("Użytkownik o podanym adresie e-mail już istnieje w naszej bazie danych")
          }
        }
      })
    })

    app.post('/login', (req, res) => {
      const user = req.body;

      db.collection('users').find({
        email: user.email,
        password: user.password
      }).toArray((error, results) => {
        if (error) {
          res.send({ isUserExist: "error", info: "Nie udało się pobrać informacji o takim użytkowniku" })
          console.log("Nie udało się pobrać informacji o takim użytkowniku")
        } else {
          if (results.length === 1) {
            res.send({ isUserExist: true, info: "Użytkownik zalogowany pomyślnie" })
            console.log("Użytkownik zalogowany pomyślnie")
          } else {
            res.send({ isUserExist: false, info: "Niepoprawny adres email lub hasło" })
            console.log("Niepoprawny adres email lub hasło")
          }
        }
      })
    })

    app.post('/userIntegrators', (req, res) => {
      const currentUser = req.body.currentUser;
      let userIntegrators = [];
      db.collection('users').find({
        email: currentUser
      }).toArray((error, result) => {
        if (error) {
          res.send("Nie udało się znależć użytkownika")
          console.log("Nie udało się znależć użytkownika", error)
        } else {
          if (result.length === 1) {
            // Ta część kodu sprawdza czy aktualnie zalogowany użytkownik posiada integrator ShopGold-AMPPolska. Jeżeli tak to dodaje jego nazwę do tablicy userIntegrators.
            db.collection('ampPolska').find({
              userID: result[0]._id
            }).toArray((error, result) => {
              if (error) {
                res.send("Coś poszło nie tak")
                console.log("Coś poszło nie tak", error)
              } else {
                if (result.length === 1) {
                  userIntegrators.push("ShopGold-AMPPolska")
                  res.send(userIntegrators)
                }
              }
            })
            // Ta część kodu sprawdza czy aktualnie zalogowany użytkownik posiada integrator ShopGold-FHSahs. Jeżeli tak to dodaje jego nazwę do tablicy userIntegrators.
            db.collection('fhSahs').find({
              userID: result[0]._id
            }).toArray((error, result) => {
              if (error) {
                res.send("Coś poszło nie tak")
                console.log("Coś poszło nie tak", error)
              } else {
                if (result.length === 1) {
                  userIntegrators.push("ShopGold-FHSahs")
                  res.send(userIntegrators)
                }
              }
            })
          }
        }
      })
    })

    app.post('/addAmpPolska', (req, res) => {
      const ampAPI = req.body;
      db.collection('users').find({
        email: ampAPI.currentUser
      }).toArray((error, result) => {
        if (error) {
          res.send("Nie udało się pobrać informacji o użytkowniku")
          console.log("Nie udało się pobrać informacji o użytkowniku", error)
        } else {
          if (result.length === 1) {
            db.collection('ampPolska').insertOne({
              productsApi: ampAPI.productsApi,
              qtyApi: ampAPI.qtyApi,
              userID: result[0]._id
            }, (error, result) => {
              if (error) {
                res.send("Nie udało się dodać danych API integratora AMP Polska")
                console.log("Nie udało się dodać danych API integratora AMP Polska", error)
              } else {
                res.send("Dane API AMP Polska dodane pomyślnie")
                console.log("Dane API AMP Polska dodane pomyślnie")
              }
            })
          }
        }
      })
    })

    app.post('/ampPolskaAPI', (req, res) => {
      const currentUser = req.body.currentUser;
      db.collection('users').find({
        email: currentUser
      }).toArray((error, result) => {
        if (error) {
          res.send("Nie udało się znależć użytkownika")
          console.log("Nie udało się znależć użytkownika", error)
        } else {
          if (result.length === 1) {
            db.collection('ampPolska').find({
              userID: result[0]._id
            }).toArray((error, result) => {
              if (error) {
                res.send("Nie udało się pobrać informacji z bazy danych")
                console.log("Nie udało się pobrać informacji z bazy danych", error)
              } else {
                if (result.length === 0) {
                  res.send("Ten użytkownik nie ma dodanego integratora Shopgold AMP Polska")
                  console.log("Ten użytkownik nie ma dodanego integratora Shopgold AMP Polska")
                }
                if (result.length === 1) {
                  res.send({ productsApi: result[0].productsApi, qtyApi: result[0].qtyApi, isJoined: true })
                }
              }
            })
          }
        }
      })
    })

    app.use((req, res, next) => {
      res.sendFile(path.join(__dirname, "./client/build", "index.html"));
    });

    //db.collection('ampPolska').remove()
    /*
    db.collection('ampPolska').find({}).toArray((error, results) => {
      if (error) {
        console.log(error)
      } else {
        console.log(results)
      }
    })
    */


    console.log("Database connection is OK")
  }
})

app.listen(port, '127.0.0.1', () => console.log(`Serwer nasłuchuje na porcie: http://localhost:${port}`))