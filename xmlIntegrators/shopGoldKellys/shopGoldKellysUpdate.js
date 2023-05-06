const fs = require("fs");
var parseString = require("xml2js").parseString;
const { toXML } = require("jstoxml");

const uploadFileToFTP = require("../../utils/uploadFileToFTP");

module.exports = function (userId) {
  fs.readFile(`./input/kellysupdate-${userId}.xml`, "utf8", (err, data) => {
    if (err) {
      console.log("Coś poszło nie tak", err);
    } else {
      const xml = data;
      parseString(xml, (err, result) => {
        if (err) {
          return console.log("Nieprawidłowe dane", err);
        } else {
          let products = result.rss.channel[0].item; //.slice(0, 2000);

          let accessories = products.filter((product) => {
            return (
              product["g:product_type"] !== undefined &&
              !product["g:product_type"][0].includes("ROWERY") &&
              product["title"][0].length !== 0
            );
          });
          for (let i = 0; i < accessories.length; i++) {
            const id = accessories[i]["g:id"][0].trim();
            const quantity = accessories[i]["g:quantity"][0].trim();
            const qty = Number(quantity).toFixed(2);
            //const availability = accessories[i]["g:availability"][0].trim(); // availibolity = out of stock === quantity = "0"
            delete accessories[i]["g:availability"];
            delete accessories[i]["g:size"];
            delete accessories[i]["g:color"];
            delete accessories[i]["g:item_group_id"];
            delete accessories[i]["g:gtin"];
            delete accessories[i]["g:image_link"];
            delete accessories[i].description;
            delete accessories[i]["g:id"];
            delete accessories[i]["g:price"];
            delete accessories[i]["g:product_type"];
            delete accessories[i]["g:shipping_weight"];
            delete accessories[i].title;
            delete accessories[i]["g:quantity"];

            /* Tworzy tag xml Nr_katalogowy oraz usuwa niepotrzebny tag pochodzący z pliku wchodzącego kellysInput.xml */
            accessories[i].Nr_katalogowy = {
              __cdata: [id],
            };

            accessories[i].Dostepnosc = {
              __cdata: [],
            };

            /* Tworzy tag xml Dostepnosc */
            if (Number(qty) === 0) {
              accessories[i].Dostepnosc.__cdata = ["Wyprzedane"];
            } else if (Number(qty) > 0 && Number(qty) < 6) {
              accessories[i].Dostepnosc.__cdata = ["Na wyczerpaniu"];
            } else if (Number(qty) > 5) {
              accessories[i].Dostepnosc.__cdata = ["Dostępny"];
            }

            console.log(
              `Przetwarzam dane: ${((i / accessories.length) * 100).toFixed(
                0
              )} %`
            );
          }
          let finalData = {};
          finalData.Produkty = [];

          for (let i = 0; i < accessories.length; i++) {
            finalData.Produkty.push({ Produkt: accessories[i] });
          }
          const xmlVersion = `<?xml version="1.0" encoding="UTF-8"?>`;
          const xml = toXML(finalData)
            .replace(/<__cdata>/g, "<![CDATA[")
            .replace(/<(\/)?__cdata[^>]*>/g, "]]>");

          const finalXML = xmlVersion.concat(xml);

          fs.writeFile(
            `./client/src/outputFiles/kellysupdate-${userId}.xml`,
            finalXML,
            (err) => {
              if (err) {
                console.log("Nie udało się zapisać pliku", err);
              } else {
                console.log("Plik został zapisany :)");
                uploadFileToFTP(
                  `./client/src/outputFiles/kellysupdate-${userId}.xml`,
                  `public_html/import/kellysupdate-${userId}.xml`
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
