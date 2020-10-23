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

    app.use((req, res, next) => {
      res.sendFile(path.join(__dirname, "./client/build", "index.html"));
    });

    db.collection('users').find({}).toArray((error, results) => {
      if (error) {
        console.log(error)
      } else {
        console.log(results)
      }
    })
    console.log("Database connection is OK")
  }
})

app.listen(port, '127.0.0.1', () => console.log(`Serwer nasłuchuje na porcie: http://localhost:${port}`))