const fs = require("fs");
var parseString = require("xml2js").parseString;
const { toXML } = require("jstoxml");

const uploadFileToFTP = require("../../utils/uploadFileToFTP");

module.exports = function (userId) {
  fs.readFile(`./input/fhsahsupdate-${userId}.xml`, "utf8", (err, data) => {
    if (err) {
      console.log("Coś poszło nie tak", err);
    } else {
      const xml = data;
      parseString(xml, (err, result) => {
        if (err) {
          return console.log("Nieprawidłowe dane", err);
        } else {
          let products = result.products.product; //.slice(6, 7);
          for (let i = 0; i < products.length; i++) {
            // Tworzenie zmiennych
            const nrKatalogowy = products[i].symbol[0]
              .replace(/(?:\\[rn])+/g, "")
              .trim();
            const dostepnosc = products[i].dostepny[0]
              .replace(/<[^>]*>/g, "")
              .trim();
            // Usuwanie niepotrzebnych elementów
            delete products[i].id;
            delete products[i].EAN;
            delete products[i].image1;
            delete products[i].image2;
            delete products[i].name;
            delete products[i].jm;
            delete products[i].cenaprzedrabatem;
            delete products[i].opis;
            // Numer katalogowy
            products[i].Nr_katalogowy = {
              __cdata: [nrKatalogowy],
            };
            delete products[i].symbol;
            // Dostępność
            products[i].Dostepnosc = {
              __cdata: [],
            };
            if (dostepnosc.includes("dostępny")) {
              products[i].Dostepnosc.__cdata[0] = "Dostępny";
            } else if (dostepnosc.includes("chwilowy brak")) {
              products[i].Dostepnosc.__cdata[0] = "Wyprzedane";
            } else if (dostepnosc.includes("na wyczerpaniu")) {
              products[i].Dostepnosc.__cdata[0] = "Na wyczerpaniu";
            } else {
              if (Number(dostepnosc.match(/\d+/)[0]) === 0) {
                products[i].Dostepnosc.__cdata[0] = "Wyprzedane";
              }
              if (
                Number(dostepnosc.match(/\d+/)[0]) > 0 &&
                Number(dostepnosc.match(/\d+/)[0]) < 6
              ) {
                products[i].Dostepnosc.__cdata[0] = "Na wyczerpaniu";
              }
              if (Number(dostepnosc.match(/\d+/)[0]) > 5) {
                products[i].Dostepnosc.__cdata[0] = "Dostępny";
              }
            }
            delete products[i].dostepny;
            console.log(
              `Przetwarzam dane: ${((i / products.length) * 100).toFixed(0)} %`
            );
          }
          let finalData = {};
          finalData.Produkty = [];

          for (let i = 0; i < products.length; i++) {
            finalData.Produkty.push({ Produkt: products[i] });
          }
          const xmlVersion = `<?xml version="1.0" encoding="UTF-8"?>`;
          const xml = toXML(finalData)
            .replace(/<__cdata>/g, "<![CDATA[")
            .replace(/<(\/)?__cdata[^>]*>/g, "]]>");

          const finalXML = xmlVersion.concat(xml);

          fs.writeFile(
            `./client/src/outputFiles/fhsahsupdate-${userId}.xml`,
            finalXML,
            (err) => {
              if (err) {
                console.log("Nie udało się zapisać pliku", err);
              } else {
                console.log("Plik został zapisany :)");
                uploadFileToFTP(
                  `./client/src/outputFiles/fhsahsupdate-${userId}.xml`,
                  `public_html/import/fhsahsupdate-${userId}.xml`
                );
                fs.readdir("./client/src/outputFiles", (err, files) => {
                  if (err) console.log(err);
                  else {
                    console.log(files);
                  }
                });
              }
            }
          );
        }
      });
    }
  });
};
