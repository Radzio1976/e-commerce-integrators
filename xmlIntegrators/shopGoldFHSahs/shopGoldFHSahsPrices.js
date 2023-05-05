const fs = require("fs");
var parseString = require("xml2js").parseString;
const { toXML } = require("jstoxml");

const uploadFileToFTP = require("../../utils/uploadFileToFTP");

module.exports = function (userId) {
  fs.readFile(`./input/fhsahsprices-${userId}.xml`, "utf8", (err, data) => {
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
            delete products[i].opis;
            delete products[i].dostepny;
            // Numer katalogowy
            products[i].Nr_katalogowy = {
              __cdata: [nrKatalogowy],
            };
            delete products[i].symbol;
            /////////////////////////////////////////////////
            const cenaPrzedRabatem = Number(
              products[i].cenaprzedrabatem[0]
                .replace(/(?:\\[rn])+/g, "")
                .replace(/{/g, "")
                .replace(/}}/g, "")
                .replace(/,/g, ".")
                .trim()
            );
            // Cena brutto
            let nettoPrice = 0;
            let vat = 0;
            let bruttoPrice = 0;
            nettoPrice = cenaPrzedRabatem; // cena bez vatu (typ number)
            delete products[i].cenaprzedrabatem;
            vat = Number((Number(nettoPrice) * 0.23).toFixed(2)); // vat (typ number)
            bruttoPrice = Number((nettoPrice + vat).toFixed(2)); // cena brutto (typ string)
            let bruttoPriceWithMargin = 0;
            if (bruttoPrice >= 0 && bruttoPrice <= 5) {
              bruttoPriceWithMargin = (bruttoPrice * 2).toFixed(2); // pierwszy poziom cenowy cena >= 0 && cena <= 5 zł (marża 100%)
            }
            if (bruttoPrice > 5 && bruttoPrice <= 10) {
              bruttoPriceWithMargin = (bruttoPrice * 1.7).toFixed(2); // drugi poziom cenowy cena > 5zł && cena <= 10 zł (marża 70%)
            }
            if (bruttoPrice > 10 && bruttoPrice <= 50) {
              bruttoPriceWithMargin = (bruttoPrice * 1.5).toFixed(2); // trzeci poziom cenowy cena > 10 zł && cena <= 50 zł (marża 50%)
            }
            if (bruttoPrice > 50) {
              bruttoPriceWithMargin = (bruttoPrice * 1.4).toFixed(2); // cena > 50 zł (marża 40%)
            }
            products[i].Cena_brutto = bruttoPriceWithMargin; // cena końcowa brutto z odpowiednią marżą
            delete products[i].cenaprzedrabatem;
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
            `./client/src/outputFiles/fhsahsprices-${userId}.xml`,
            finalXML,
            (err) => {
              if (err) {
                console.log("Nie udało się zapisać pliku", err);
              } else {
                console.log("Plik został zapisany :)");
                uploadFileToFTP(
                  `./client/src/outputFiles/fhsahsprices-${userId}.xml`,
                  `public_html/import/fhsahsprices-${userId}.xml`
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
