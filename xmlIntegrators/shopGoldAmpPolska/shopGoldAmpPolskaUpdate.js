const fs = require("fs");
var parseString = require("xml2js").parseString;
const { toXML } = require("jstoxml");

module.exports = function (userId) {
  fs.readFile("./input/ampupdate.xml", "utf8", (err, data) => {
    if (err) {
      console.log("Coś poszło nie tak", err);
    } else {
      const xml = data;
      parseString(xml, (err, result) => {
        if (err) {
          return console.log("Nieprawidłowe dane", err);
        } else {
          let items = result.products.product;
          for (let i = 0; i < items.length; i++) {
            delete items[i]["availability"];
            delete items[i]["inStock"];
            delete items[i]["sku"];

            if (
              items[i].ean[0].replace(/(?:\\[rn])+/g, "").trim().length === 0
            ) {
              delete items[i].ean;
            } else {
              items[i].Kod_ean = {
                __cdata: [items[i].ean[0].replace(/(?:\\[rn])+/g, "").trim()],
              };
              delete items[i].ean;
            }

            items[i].Nr_katalogowy = {
              __cdata: [items[i].id],
            };
            delete items[i].id;

            items[i].Ilosc_produktow = items[i].qty[0].replace(/,/g, ".");
            items[i].Ilosc_produktow = Number(items[i].Ilosc_produktow).toFixed(
              2
            );
            delete items[i].qty;

            items[i].Dostepnosc = {
              __cdata: [],
            };

            if (Number(items[i].Ilosc_produktow) === 0) {
              items[i].Dostepnosc.__cdata[0] = "Wyprzedane";
            } else if (
              Number(items[i].Ilosc_produktow) > 0 &&
              Number(items[i].Ilosc_produktow) < 6
            ) {
              items[i].Dostepnosc.__cdata[0] = "Na wyczerpaniu";
            } else if (Number(items[i].Ilosc_produktow) > 5) {
              items[i].Dostepnosc.__cdata[0] = "Dostępny";
            }
            console.log(
              `Przetwarzam dane: ${((i / items.length) * 100).toFixed(0)} %`
            );
          }
          let finalData = {};
          finalData.Produkty = [];

          for (let i = 0; i < items.length; i++) {
            finalData.Produkty.push({ Produkt: items[i] });
          }
          const xmlVersion = `<?xml version="1.0" encoding="UTF-8"?>`;
          const xml = toXML(finalData)
            .replace(/<__cdata>/g, "<![CDATA[")
            .replace(/<(\/)?__cdata[^>]*>/g, "]]>");

          const finalXML = xmlVersion.concat(xml);
          let today = new Date();
          let time =
            today.getFullYear() +
            "-" +
            (today.getMonth() + 1) +
            "-" +
            today.getDate() +
            "-" +
            today.getHours() +
            "-" +
            today.getMinutes() +
            "-" +
            today.getSeconds();

          fs.writeFile(
            `./client/src/ampOutputFiles/ampupdate-${time}-userid-${userId}.xml`,
            finalXML,
            (err) => {
              if (err) {
                console.log("Nie udało się zapisać pliku", err);
              } else {
                console.log("Plik został zapisany :)");
                fs.readdir("./client/src/ampOutputFiles", (err, files) => {
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
