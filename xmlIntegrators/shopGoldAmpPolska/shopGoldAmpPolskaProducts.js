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
          let items = result.products.product.slice(
            6500,
            result.products.product.length
          );
          let names = [];
          let urls = [];

          //Szukanie uszkodzonego produktu///////////////////////////////////////////
          let productsWithoutBug = items.filter((item, index) => {
            return !item.desc[0].includes("\r\n");
          });

          items = productsWithoutBug;

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
                __cdata: [],
              };
              delete items[i].brand;
            } else {
              items[i].Producent = {
                __cdata: [
                  items[i].brand[0]._.replace(/(?:\\[rn])+/g, "").trim(),
                ],
              };
              delete items[i].brand;
            }

            items[i].Termin_wysylki = {
              __cdata: ["48 godzin"],
            };

            items[i].Stan_produktu = {
              __cdata: ["Nowy"],
            };

            if (Number(items[i].retailPriceGross[0].replace(/,/g, ".")) === 0) {
              items[i].Status = "nie";
            } else {
              items[i].Status = "tak";
            }

            if (
              items[i].desc[0].replace(/(?:\\[rn])+/g, "").trim().length === 0
            ) {
              items[i].Opis = {
                __cdata: [],
              };
              delete items[i].desc;
            } else {
              items[i].Opis = {
                __cdata: [
                  items[i].desc[0]
                    .replace(/<br(\/)>/g, "<br>")
                    .replace(/(?:\\[rn])+/g, "")
                    .trim(),
                ],
              };
              delete items[i].desc;
            }

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

            if (items[i].photos[0].length === 47) {
              delete items[i].photos;
            } else {
              let photosArray = items[i].photos[0].photo;
              let morePhotos = [];

              if (photosArray.length === 1) {
                items[i].Zdjecie_glowne = photosArray[0]._.replace(
                  /(?:\\[rn])+/g,
                  ""
                ).trim();
                items[i].Zdjecie_glowne_opis = items[i].name[0]
                  .replace(/&/g, "AND")
                  .replace(/</g, "-")
                  .replace(/=</g, "-")
                  .replace(/(?:\\[rn])+/g, "")
                  .trim();
                delete items[i].photos;
              }
              if (photosArray.length > 1) {
                items[i].Zdjecie_glowne = photosArray[0]._.replace(
                  /(?:\\[rn])+/g,
                  ""
                ).trim();
                items[i].Zdjecie_glowne_opis = items[i].name[0]
                  .replace(/&/g, "AND")
                  .replace(/</g, "-")
                  .replace(/=</g, "-")
                  .replace(/(?:\\[rn])+/g, "")
                  .trim();
                for (let k = 1; k < photosArray.length; k++) {
                  morePhotos.push(
                    photosArray[k]._.replace(/(?:\\[rn])+/g, "").trim()
                  );
                }

                let Zdjecie = [];
                for (let i = 0; i < morePhotos.length; i++) {
                  Zdjecie.push({ Zdjecie: { Zdjecie_link: morePhotos[i] } });
                }

                items[i].Zdjecia_dodatkowe = Zdjecie;
                delete items[i].photos;
              }
            }

            items[i].Cena_brutto = items[i]["retailPriceGross"][0].replace(
              /,/g,
              "."
            );
            items[i].Cena_brutto = Number(items[i].Cena_brutto).toFixed(2);
            delete items[i]["retailPriceGross"];

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

            if (items[i].categories[0].category === undefined) {
              items[i].Kategoria = {
                __cdata: ["OSTATNIO DODANE/NIESKLASYFIKOWANE"],
              };
              delete items[i].categories;
            } else {
              items[i].Kategoria = {
                __cdata: [
                  `OSTATNIO DODANE/${items[i].categories[0].category[
                    items[i].categories[0].category.length - 1
                  ]._.replace(/(?:\\[rn])+/g, "")
                    .replace(/ (\/) /g, "/")
                    .trim()}`,
                ],
              };
              delete items[i].categories;
            }

            if (items[i].weight[0] === "") {
              delete items[i].weight;
            } else {
              items[i].Waga = items[i].weight[0];
              delete items[i].weight;
            }

            items[i].Jednostka_miary = {
              __cdata: [items[i].unit[0].replace(/(?:\\[rn])+/g, "").trim()],
            };
            delete items[i].unit;

            items[i].Nazwa_produktu = {
              __cdata: [
                items[i].name[0]
                  .replace(/&/g, "AND")
                  .replace(/</g, "-")
                  .replace(/=</g, "-")
                  .replace(/(?:\\[rn])+/g, "")
                  .trim(),
              ],
            };
            delete items[i].name;

            items[i].Meta_tytul = {
              __cdata: [items[i].Nazwa_produktu.__cdata[0]],
            };

            items[i].Meta_opis = {
              __cdata: [items[i].Nazwa_produktu.__cdata[0]],
            };

            items[i].Opis_krotki = {
              __cdata: [items[i].Nazwa_produktu.__cdata[0]],
            };

            if (items[i].Producent.__cdata[0] === undefined) {
              items[i].Meta_slowa = {
                __cdata: [
                  "akcesoria rowerowe, części rowerowe, ubrania rowerowe, sklep rowerowy, rowery akcesoria, rowery",
                ],
              };
            } else {
              items[i].Meta_slowa = {
                __cdata: [
                  `${items[i].Producent.__cdata[0]}, akcesoria rowerowe, części rowerowe, ubrania rowerowe, sklep rowerowy, rowery akcesoria`,
                ],
              };
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
                items[i].Opis.__cdata.unshift(
                  `<a href="/images/${
                    urls[k] !== undefined ? urls[k].slice(21) : ""
                  }" target="_blank"><img alt="alt" src="/images/${
                    urls[k] !== undefined ? urls[k].slice(21) : ""
                  }" width = "300px" /></a > <br />`
                );
              }
            }

            for (let k = 0; k < names.length; k++) {
              if (i === k) {
                items[i].Opis.__cdata.unshift(`<b>${names[i]}</b><br />`);
              }
            }

            let desc1 = items[i].Opis.__cdata[0];
            let desc2 = items[i].Opis.__cdata[1];
            let desc3 = items[i].Opis.__cdata[2];
            if (desc3 === undefined) {
              desc3 = "";
            } else {
              desc3 = items[i].Opis.__cdata[2];
            }

            let descResult = "";
            descResult = desc1.concat(desc2, desc3);
            items[i].Opis = {
              __cdata: [descResult],
            };
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
            `./client/src/ampOutputFiles/ampproducts-${time}-userid-${userId}.xml`,
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
