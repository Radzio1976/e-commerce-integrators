const express = require('express');
const fs = require('fs');
const path = require('path');
var parseString = require('xml2js').parseString;
const { toXML } = require('jstoxml');
require('dotenv').config();
const axios = require('axios');
var cors = require('cors');
const bodyParser = require("body-parser");
const ProgressBar = require('progress');
const port = process.env.PORT || 8080;
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, "./client/build")));

const addUser = require('./httpRequests/addUser');

const mongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
const dbname = 'e-commerce-integrators';

mongoClient.connect(url, {}, (error, client) => {
  if (error) {
    console.log("Nie można połączyć się z bazą danych")
  } else {
    const db = client.db(dbname)

    app.post('/addUser', (req, res) => {
      addUser(req, res, db)
    });

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

    app.post('/users-integrators', (req, res) => {
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

    app.post('/shopgold-amppolska', (req, res) => {
      const data = req.body;
      db.collection('users').find({
        email: data.currentUser
      }).toArray((error, result) => {
        if (error) {
          res.send("Nie udało się znależć użytkownika")
          console.log("Nie udało się znależć użytkownika", error)
        } else {
          if (result.length === 1) {

            if (data.action === "addAmpApi") {
              db.collection('ampPolska').insertOne({
                productsApi: data.productsApi,
                qtyApi: data.qtyApi,
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

            if (data.action === "getAmpApi") {
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

            if (data.action === "getAMPProductsFile") {
              db.collection('ampPolska').find({
                userID: result[0]._id
              }).toArray((error, result) => {
                if (error) {
                  res.send("Nie udało się pobrać informacji z bazy danych")
                  console.log("Nie udało się pobrać informacji z bazy danych", error)
                } else {
                  if (result.length === 0) {
                    res.send("Ten użytkownik nie ma dodanych adresów API Shopgold AMP Polska")
                    console.log("Ten użytkownik nie ma dodanych adresów API Shopgold AMP Polska")
                  }
                  if (result.length === 1) {
                    async function downloadAMPProductsFile() {
                      //const url = process.env.AMP_PRODUCTS_API_URL
                      const url = result[0].productsApi;
                      const userId = result[0].userID;

                      console.log('Connecting …')
                      const { data, headers } = await axios({
                        url,
                        method: 'GET',
                        responseType: 'stream'
                      })
                      const totalLength = headers['content-length']

                      console.log('Starting download')
                      const progressBar = new ProgressBar('-> downloading [:bar] :percent :etas', {
                        width: 40,
                        complete: '=',
                        incomplete: ' ',
                        renderThrottle: 1,
                        total: parseInt(totalLength)
                      })

                      const writer = fs.createWriteStream(
                        path.resolve(__dirname, 'input', 'ampproducts.xml')
                      )

                      data.on('data', (chunk) => progressBar.tick(chunk.length))
                      data.pipe(writer)
                      data.on('end', function () {
                        fs.readFile('./input/ampproducts.xml', 'utf8', (err, data) => {
                          if (err) {
                            console.log("Coś poszło nie tak", err)
                          } else {
                            const xml = data;
                            parseString(xml, (err, result) => {
                              if (err) {
                                return console.log("Nieprawidłowe dane", err)
                              } else {
                                let items = result.products.product//.slice(2038, 2039);
                                let names = [];
                                let urls = [];

                                for (let i = 0; i < items.length; i++) {
                                  delete items[i].sku;

                                  delete items[i].url;

                                  delete items[i].attributes;

                                  delete items[i].PKWiU;

                                  delete items[i].inStock;

                                  delete items[i].availability;

                                  delete items[i].requiredBox;

                                  delete items[i].quantityPerBox;

                                  delete items[i].priceAfterDiscountNet;

                                  delete items[i].vat;

                                  delete items[i].model;

                                  items[i].Podatek_Vat = "23";

                                  items[i].Darmowa_dostawa = "nie";

                                  if (items[i].brand === undefined) {

                                    items[i].Producent = {
                                      __cdata: []
                                    };
                                    delete items[i].brand
                                  } else {
                                    items[i].Producent = {
                                      __cdata: [items[i].brand[0]._.replace(/(?:\\[rn])+/g, "").trim()]
                                    };
                                    delete items[i].brand
                                  }

                                  items[i].Termin_wysylki = {
                                    __cdata: ["48 godzin"]
                                  }

                                  items[i].Stan_produktu = {
                                    __cdata: ["Nowy"]
                                  }

                                  if (Number(items[i].retailPriceGross[0].replace(/,/g, ".")) === 0) {
                                    items[i].Status = "nie"
                                  } else {
                                    items[i].Status = "tak"
                                  }

                                  if (items[i].desc[0].replace(/(?:\\[rn])+/g, "").trim().length === 0) {
                                    items[i].Opis = {
                                      __cdata: []
                                    };
                                    delete items[i].desc
                                  } else {
                                    items[i].Opis = {
                                      __cdata: [items[i].desc[0].replace(/<br(\/)>/g, "<br>").replace(/(?:\\[rn])+/g, "").trim()]
                                    };
                                    delete items[i].desc
                                  }

                                  if (items[i].ean[0].replace(/(?:\\[rn])+/g, "").trim().length === 0) {
                                    delete items[i].ean;
                                  } else {
                                    items[i].Kod_ean = {
                                      __cdata: [items[i].ean[0].replace(/(?:\\[rn])+/g, "").trim()]
                                    }
                                    delete items[i].ean;
                                  }

                                  items[i].Nr_katalogowy = {
                                    __cdata: [items[i].id]
                                  }
                                  delete items[i].id;

                                  if (items[i].photos[0].length === 47) {
                                    delete items[i].photos
                                  } else {
                                    let photosArray = items[i].photos[0].photo
                                    let morePhotos = []

                                    if (photosArray.length === 1) {
                                      items[i].Zdjecie_glowne = photosArray[0]._.replace(/(?:\\[rn])+/g, "").trim();
                                      items[i].Zdjecie_glowne_opis = items[i].name[0].replace(/&/g, "AND").replace(/(?:\\[rn])+/g, "").trim();
                                      delete items[i].photos
                                    }
                                    if (photosArray.length > 1) {
                                      items[i].Zdjecie_glowne = photosArray[0]._.replace(/(?:\\[rn])+/g, "").trim();
                                      items[i].Zdjecie_glowne_opis = items[i].name[0].replace(/&/g, "AND").replace(/(?:\\[rn])+/g, "").trim();
                                      for (let k = 1; k < photosArray.length; k++) {
                                        morePhotos.push(photosArray[k]._.replace(/(?:\\[rn])+/g, "").trim())
                                      }

                                      let Zdjecie = []
                                      for (let i = 0; i < morePhotos.length; i++) {
                                        Zdjecie.push({ Zdjecie: { Zdjecie_link: morePhotos[i] } })
                                      }

                                      items[i].Zdjecia_dodatkowe = Zdjecie
                                      delete items[i].photos
                                    }
                                  }

                                  items[i].Cena_brutto = items[i]['retailPriceGross'][0].replace(/,/g, ".");
                                  items[i].Cena_brutto = Number(items[i].Cena_brutto).toFixed(2);
                                  delete items[i]['retailPriceGross']

                                  items[i].Ilosc_produktow = items[i].qty[0].replace(/,/g, ".");
                                  items[i].Ilosc_produktow = Number(items[i].Ilosc_produktow).toFixed(2);
                                  delete items[i].qty;

                                  items[i].Dostepnosc = {
                                    __cdata: []
                                  }

                                  if (Number(items[i].Ilosc_produktow) === 0) {
                                    items[i].Dostepnosc.__cdata[0] = "Wyprzedane"
                                  } else if (Number(items[i].Ilosc_produktow) > 0 && Number(items[i].Ilosc_produktow) < 6) {
                                    items[i].Dostepnosc.__cdata[0] = "Na wyczerpaniu"
                                  } else if (Number(items[i].Ilosc_produktow) > 5) {
                                    items[i].Dostepnosc.__cdata[0] = "Dostępny"
                                  }

                                  if (items[i].categories[0].category === undefined) {

                                    items[i].Kategoria = {
                                      __cdata: ["OSTATNIO DODANE/NIESKLASYFIKOWANE"]
                                    };
                                    delete items[i].categories
                                  } else {
                                    items[i].Kategoria = {
                                      __cdata: [`OSTATNIO DODANE/${items[i].categories[0].category[items[i].categories[0].category.length - 1]._.replace(/(?:\\[rn])+/g, "").replace(/ (\/) /g, "/").trim()}`]
                                    };
                                    delete items[i].categories
                                  }

                                  if (items[i].weight[0] === "") {
                                    delete items[i].weight;
                                  } else {
                                    items[i].Waga = items[i].weight[0];
                                    delete items[i].weight;
                                  }

                                  items[i].Jednostka_miary = {
                                    __cdata: [items[i].unit[0].replace(/(?:\\[rn])+/g, "").trim()]
                                  }
                                  delete items[i].unit;

                                  items[i].Nazwa_produktu = {
                                    __cdata: [items[i].name[0].replace(/&/g, "AND").replace(/(?:\\[rn])+/g, "").trim()]
                                  }
                                  delete items[i].name;

                                  items[i].Meta_tytul = {
                                    __cdata: [items[i].Nazwa_produktu.__cdata[0]]
                                  }

                                  items[i].Meta_opis = {
                                    __cdata: [items[i].Nazwa_produktu.__cdata[0]]
                                  }

                                  items[i].Opis_krotki = {
                                    __cdata: [items[i].Nazwa_produktu.__cdata[0]]
                                  }

                                  if (items[i].Producent.__cdata[0] === undefined) {
                                    items[i].Meta_slowa = {
                                      __cdata: ["akcesoria rowerowe, części rowerowe, ubrania rowerowe, sklep rowerowy, rowery akcesoria, rowery"]
                                    }
                                  } else {
                                    items[i].Meta_slowa = {
                                      __cdata: [`${items[i].Producent.__cdata[0]}, akcesoria rowerowe, części rowerowe, ubrania rowerowe, sklep rowerowy, rowery akcesoria`]
                                    }
                                  }

                                  //--------------------------------------------------------------------------------------------//
                                  /*
                                  Linijka kodu poniżej służy do usuwania kategorii. Odkomentowywać ją tylko jeśli potrzebny jest plik
                                  tylko do aktualizacji. Do wystawiania produktów powinna być zakomentowana.
                                  */
                                  //delete items[i].Kategoria
                                  //--------------------------------------------------------------------------------------------//

                                  names.push(items[i].Nazwa_produktu.__cdata[0]);
                                  urls.push(items[i].Zdjecie_glowne);

                                  for (let k = 0; k < urls.length; k++) {
                                    if (i === k) {
                                      items[i].Opis.__cdata.unshift(`<a href="/images/${urls[k] !== undefined ? urls[k].slice(21) : ""}" target="_blank"><img alt="alt" src="/images/${urls[k] !== undefined ? urls[k].slice(21) : ""}" width = "300px" /></a > <br />`)
                                    }
                                  }


                                  for (let k = 0; k < names.length; k++) {
                                    if (i === k) {
                                      items[i].Opis.__cdata.unshift(`<b>${names[i]}</b><br />`)
                                    }
                                  }

                                  let desc1 = items[i].Opis.__cdata[0];
                                  let desc2 = items[i].Opis.__cdata[1];
                                  let desc3 = items[i].Opis.__cdata[2];
                                  if (desc3 === undefined) {
                                    desc3 = ""
                                  } else {
                                    desc3 = items[i].Opis.__cdata[2];
                                  }

                                  let descResult = ""
                                  descResult = desc1.concat(desc2, desc3)
                                  items[i].Opis = {
                                    __cdata: [descResult]
                                  };
                                  console.log(`Przetwarzam dane: ${((i / items.length) * 100).toFixed(0)} %`)
                                }

                                let finalData = {};
                                finalData.Produkty = []

                                for (let i = 0; i < items.length; i++) {
                                  finalData.Produkty.push({ Produkt: items[i] })
                                }
                                const xmlVersion = `<?xml version="1.0" encoding="UTF-8"?>`
                                const xml = toXML(finalData).replace(/<__cdata>/g, "<![CDATA[").replace(/<(\/)?__cdata[^>]*>/g, ']]>');

                                const finalXML = xmlVersion.concat(xml);
                                let today = new Date();
                                let time = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();

                                fs.writeFile(`./client/src/ampOutputFiles/ampproducts-${time}-userid-${userId}.xml`, finalXML, (err) => {
                                  if (err) {
                                    console.log("Nie udało się zapisać pliku", err)
                                  } else {
                                    console.log('Plik został zapisany :)');
                                    fs.readdir('./client/src/ampOutputFiles', (err, files) => {
                                      if (err)
                                        console.log(err);
                                      else {
                                        console.log(files)
                                      }
                                    })
                                  }
                                });
                              }
                            })
                          }
                        })
                      })
                    }
                    downloadAMPProductsFile()
                  }
                }
              })
            }

            if (data.action === "getAMPUpdateFile") {
              db.collection('ampPolska').find({
                userID: result[0]._id
              }).toArray((error, result) => {
                if (error) {
                  res.send("Nie udało się pobrać informacji z bazy danych")
                  console.log("Nie udało się pobrać informacji z bazy danych", error)
                } else {
                  if (result.length === 0) {
                    res.send("Ten użytkownik nie ma dodanych adresów API Shopgold AMP Polska")
                    console.log("Ten użytkownik nie ma dodanych adresów API Shopgold AMP Polska")
                  }
                  if (result.length === 1) {
                    async function downloadAMPUpdateFile() {
                      //const url = process.env.AMP_UPDATE_API_URL
                      const url = result[0].qtyApi;
                      const userId = result[0].userID;

                      console.log('Connecting …')
                      const { data, headers } = await axios({
                        url,
                        method: 'GET',
                        responseType: 'stream'
                      })
                      const totalLength = headers['content-length']

                      console.log('Starting download')
                      const progressBar = new ProgressBar('-> downloading [:bar] :percent :etas', {
                        width: 40,
                        complete: '=',
                        incomplete: ' ',
                        renderThrottle: 1,
                        total: parseInt(totalLength)
                      })

                      const writer = fs.createWriteStream(
                        path.resolve(__dirname, 'input', 'ampupdate.xml')
                      )

                      data.on('data', (chunk) => progressBar.tick(chunk.length))
                      data.pipe(writer)
                      data.on('end', function () {
                        fs.readFile('./input/ampupdate.xml', 'utf8', (err, data) => {
                          if (err) {
                            console.log("Coś poszło nie tak", err)
                          } else {
                            const xml = data;
                            parseString(xml, (err, result) => {
                              if (err) {
                                return console.log("Nieprawidłowe dane", err)
                              } else {
                                let items = result.products.product
                                for (let i = 0; i < items.length; i++) {
                                  delete items[i]['availability'];
                                  delete items[i]['inStock'];
                                  delete items[i]['sku'];

                                  if (items[i].ean[0].replace(/(?:\\[rn])+/g, "").trim().length === 0) {
                                    delete items[i].ean;
                                  } else {
                                    items[i].Kod_ean = {
                                      __cdata: [items[i].ean[0].replace(/(?:\\[rn])+/g, "").trim()]
                                    }
                                    delete items[i].ean;
                                  }

                                  items[i].Nr_katalogowy = {
                                    __cdata: [items[i].id]
                                  }
                                  delete items[i].id;

                                  items[i].Ilosc_produktow = items[i].qty[0].replace(/,/g, ".");
                                  items[i].Ilosc_produktow = Number(items[i].Ilosc_produktow).toFixed(2);
                                  delete items[i].qty;

                                  items[i].Dostepnosc = {
                                    __cdata: []
                                  }

                                  if (Number(items[i].Ilosc_produktow) === 0) {
                                    items[i].Dostepnosc.__cdata[0] = "Wyprzedane"
                                  } else if (Number(items[i].Ilosc_produktow) > 0 && Number(items[i].Ilosc_produktow) < 6) {
                                    items[i].Dostepnosc.__cdata[0] = "Na wyczerpaniu"
                                  } else if (Number(items[i].Ilosc_produktow) > 5) {
                                    items[i].Dostepnosc.__cdata[0] = "Dostępny"
                                  }
                                  console.log(`Przetwarzam dane: ${((i / items.length) * 100).toFixed(0)} %`)
                                }

                                let finalData = {};
                                finalData.Produkty = []

                                for (let i = 0; i < items.length; i++) {
                                  finalData.Produkty.push({ Produkt: items[i] })
                                }
                                const xmlVersion = `<?xml version="1.0" encoding="UTF-8"?>`
                                const xml = toXML(finalData).replace(/<__cdata>/g, "<![CDATA[").replace(/<(\/)?__cdata[^>]*>/g, ']]>');

                                const finalXML = xmlVersion.concat(xml);
                                let today = new Date();
                                let time = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();

                                fs.writeFile(`./client/src/ampOutputFiles/ampupdate-${time}-userid-${userId}.xml`, finalXML, (err) => {
                                  if (err) {
                                    console.log("Nie udało się zapisać pliku", err)
                                  } else {
                                    console.log('Plik został zapisany :)');
                                    fs.readdir('./client/src/ampOutputFiles', (err, files) => {
                                      if (err)
                                        console.log(err);
                                      else {
                                        console.log(files)
                                      }
                                    })
                                  }
                                });
                              }
                            })
                          }
                        })
                      })
                    }
                    downloadAMPUpdateFile()
                  }
                }
              })
            }

            if (data.action === "getAMPPricesFile") {
              db.collection('ampPolska').find({
                userID: result[0]._id
              }).toArray((error, result) => {
                if (error) {
                  res.send("Nie udało się pobrać informacji z bazy danych")
                  console.log("Nie udało się pobrać informacji z bazy danych", error)
                } else {
                  if (result.length === 0) {
                    res.send("Ten użytkownik nie ma dodanych adresów API Shopgold AMP Polska")
                    console.log("Ten użytkownik nie ma dodanych adresów API Shopgold AMP Polska")
                  }
                  if (result.length === 1) {
                    async function downloadAMPPricesFile() {
                      //const url = process.env.AMP_PRODUCTS_API_URL
                      const url = result[0].productsApi;
                      const userId = result[0].userID;

                      console.log('Connecting …')
                      const { data, headers } = await axios({
                        url,
                        method: 'GET',
                        responseType: 'stream'
                      })
                      const totalLength = headers['content-length']

                      console.log('Starting download')
                      const progressBar = new ProgressBar('-> downloading [:bar] :percent :etas', {
                        width: 40,
                        complete: '=',
                        incomplete: ' ',
                        renderThrottle: 1,
                        total: parseInt(totalLength)
                      })

                      const writer = fs.createWriteStream(
                        path.resolve(__dirname, 'input', 'ampproducts.xml')
                      )

                      data.on('data', (chunk) => progressBar.tick(chunk.length))
                      data.pipe(writer)
                      data.on('end', function () {
                        fs.readFile('./input/ampproducts.xml', 'utf8', (err, data) => {
                          if (err) {
                            console.log("Coś poszło nie tak", err)
                          } else {
                            const xml = data;
                            parseString(xml, (err, result) => {
                              if (err) {
                                return console.log("Nieprawidłowe dane", err)
                              } else {
                                let items = result.products.product//.slice(2038, 2040);
                                let names = [];
                                let urls = [];

                                for (let i = 0; i < items.length; i++) {
                                  delete items[i].sku;

                                  delete items[i].url;

                                  delete items[i].attributes;

                                  delete items[i].PKWiU;

                                  delete items[i].inStock;

                                  delete items[i].availability;

                                  delete items[i].requiredBox;

                                  delete items[i].quantityPerBox;

                                  delete items[i].priceAfterDiscountNet;

                                  delete items[i].vat;

                                  delete items[i].model;

                                  delete items[i].brand

                                  delete items[i].desc

                                  if (items[i].ean[0].replace(/(?:\\[rn])+/g, "").trim().length === 0) {
                                    delete items[i].ean;
                                  } else {
                                    items[i].Kod_ean = {
                                      __cdata: [items[i].ean[0].replace(/(?:\\[rn])+/g, "").trim()]
                                    }
                                    delete items[i].ean;
                                  }

                                  items[i].Nr_katalogowy = {
                                    __cdata: [items[i].id]
                                  }
                                  delete items[i].id;

                                  delete items[i].photos;

                                  items[i].Promocja = "tak";

                                  items[i].Cena_brutto = items[i]['retailPriceGross'][0].replace(/,/g, ".");
                                  items[i].Cena_brutto = (Number(items[i].Cena_brutto) * 0.85).toFixed(2);

                                  items[i].Cena_poprzednia = items[i]['retailPriceGross'][0].replace(/,/g, ".");
                                  items[i].Cena_poprzednia = Number(items[i].Cena_poprzednia).toFixed(2);
                                  delete items[i]['retailPriceGross']

                                  delete items[i].qty;

                                  delete items[i].categories

                                  delete items[i].weight;

                                  delete items[i].unit;

                                  delete items[i].name;

                                  console.log(`Przetwarzam dane: ${((i / items.length) * 100).toFixed(0)} %`)
                                }

                                let finalData = {};
                                finalData.Produkty = []

                                for (let i = 0; i < items.length; i++) {
                                  finalData.Produkty.push({ Produkt: items[i] })
                                }
                                const xmlVersion = `<?xml version="1.0" encoding="UTF-8"?>`
                                const xml = toXML(finalData).replace(/<__cdata>/g, "<![CDATA[").replace(/<(\/)?__cdata[^>]*>/g, ']]>');

                                const finalXML = xmlVersion.concat(xml);
                                let today = new Date();
                                let time = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();

                                fs.writeFile(`./client/src/ampOutputFiles/ampprices-${time}-userid-${userId}.xml`, finalXML, (err) => {
                                  if (err) {
                                    console.log("Nie udało się zapisać pliku", err)
                                  } else {
                                    console.log('Plik został zapisany :)');
                                    fs.readdir('./client/src/ampOutputFiles', (err, files) => {
                                      if (err)
                                        console.log(err);
                                      else {
                                        console.log(files)
                                      }
                                    })
                                  }
                                });
                              }
                            })
                          }
                        })
                      })
                    }
                    downloadAMPPricesFile()
                  }
                }
              })
            }
          }
        }
      })
    })

    app.use((req, res, next) => {
      res.sendFile(path.join(__dirname, "./client/build", "index.html"));
    });

    //db.collection('ampFiles').remove()

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