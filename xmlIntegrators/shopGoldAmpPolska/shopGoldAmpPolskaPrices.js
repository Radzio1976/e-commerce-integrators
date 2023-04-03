const fs = require("fs");
var parseString = require("xml2js").parseString;
const { toXML } = require("jstoxml");

module.exports = function (userId) {
  fs.readFile("./input/ampproducts.xml", "utf8", (err, data) => {
    if (err) {
      console.log("Coś poszło nie tak", err);
    } else {
      const xml = data;
      parseString(xml, (err, result) => {
        if (err) {
          return console.log("Nieprawidłowe dane", err);
        } else {
          let items = result.products.product; //.slice(2038, 2040);
          let names = [];
          let urls = [];

          for (let i = 0; i < items.length; i++) {
            delete items[i].$;

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

            delete items[i].brand;

            delete items[i].desc;

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

            delete items[i].photos;

            items[i].Promocja = "tak";

            items[i].Cena_brutto = items[i]["retailPriceGross"][0].replace(
              /,/g,
              "."
            );
            items[i].Cena_brutto = (
              Number(items[i].Cena_brutto) * 0.85
            ).toFixed(2);

            items[i].Cena_poprzednia = items[i]["retailPriceGross"][0].replace(
              /,/g,
              "."
            );
            items[i].Cena_poprzednia = Number(items[i].Cena_poprzednia).toFixed(
              2
            );
            delete items[i]["retailPriceGross"];

            delete items[i].qty;

            delete items[i].categories;

            delete items[i].weight;

            delete items[i].unit;

            delete items[i].name;

            // console.log(
            //   `Przetwarzam dane: ${((i / items.length) * 100).toFixed(0)} %`
            // );
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
            `./client/src/ampOutputFiles/ampprices-${time}-userid-${userId}.xml`,
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
