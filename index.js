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
              if (error)
                console.log("Nie udało się dodać użytkownika", error)

              console.log(result.ops)
            })
          } else {
            console.log("Użytkownik o podanym adresie e-mail już istnieje w naszej bazie danych")
          }
        }
      })
    })
    console.log("Database connection is OK")
  }
})

app.listen(port, '127.0.0.1', () => console.log(`Serwer nasłuchuje na porcie: http://localhost:${port}`))