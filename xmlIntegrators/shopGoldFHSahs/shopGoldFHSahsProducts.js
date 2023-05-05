const fs = require("fs");
var parseString = require("xml2js").parseString;
const { toXML } = require("jstoxml");

const uploadFileToFTP = require("../../utils/uploadFileToFTP");

module.exports = function (userId) {
  fs.readFile(`./input/fhsahsproducts-${userId}.xml`, "utf8", (err, data) => {
    if (err) {
      console.log("Coś poszło nie tak", err);
    } else {
      const xml = data;
      parseString(xml, (err, result) => {
        if (err) {
          return console.log("Nieprawidłowe dane", err);
        } else {
          let products = result.products.product; //.slice(6, 7);
          let names = [];
          let urls = [];
          for (let i = 0; i < products.length; i++) {
            // Tworzenie zmiennych
            const podatekVat = "23";
            const darmowaDostawa = "nie";
            const terminWysylki = "48 godzin";
            const stanProduktu = "Nowy";
            const nrKatalogowy = products[i].symbol[0]
              .replace(/(?:\\[rn])+/g, "")
              .trim();
            const nazwaProduktu = products[i].name[0]
              .replace(/(?:\\[rn])+/g, "")
              .replace("<", " ")
              .trim();
            const metaSlowa =
              "części rowerowe, akcesoria rowerowe, części do rowerów, akcesoria do rowerów, sklep rowerowy";
            const dostepnosc = products[i].dostepny[0]
              .replace(/<[^>]*>/g, "")
              .trim();
            const status = "tak";
            const jednostkaMiary = products[i].jm[0]
              .replace(/(?:\\[rn])+/g, "")
              .trim();
            const cenaPrzedRabatem = Number(
              products[i].cenaprzedrabatem[0]
                .replace(/(?:\\[rn])+/g, "")
                .replace(/{/g, "")
                .replace(/}}/g, "")
                .replace(/,/g, ".")
                .trim()
            );
            const zdjeciaProduktu = products[i].image2[0]
              .replace(/<[^>]*>/g, "")
              .trim()
              .split(/\s+/);
            // Usuwanie niepotrzebnych elementów
            delete products[i].id;
            delete products[i].EAN;
            delete products[i].image1;
            // Podatek VAT
            products[i].Podatek_Vat = podatekVat;
            // Darmowa dostawa
            products[i].Darmowa_dostawa = darmowaDostawa;
            products[i].Termin_wysylki = {
              __cdata: [terminWysylki],
            };
            // Stan produktu
            products[i].Stan_produktu = {
              __cdata: [stanProduktu],
            };
            // Numer katalogowy
            products[i].Nr_katalogowy = {
              __cdata: [nrKatalogowy],
            };
            delete products[i].symbol;
            // Nazwa produktu
            products[i].Nazwa_produktu = {
              __cdata: [nazwaProduktu],
            };
            delete products[i].name;
            // Meta tytuł
            products[i].Meta_tytul = {
              __cdata: [nazwaProduktu],
            };
            // Meta opis
            products[i].Meta_opis = {
              __cdata: [nazwaProduktu],
            };
            // Opis krótki
            products[i].Opis_krotki = {
              __cdata: [nazwaProduktu],
            };
            // Słowa kluczowe
            products[i].Meta_slowa = {
              __cdata: [metaSlowa],
            };
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
            // Status
            products[i].Status = status;
            // Jednostka miary
            products[i].Jednostka_miary = {
              __cdata: [jednostkaMiary],
            };
            delete products[i].jm;
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
            // Zdjęcia
            let photosArray = zdjeciaProduktu;
            // Zdjęcie główne
            products[i].Zdjecie_glowne = photosArray[0];
            // Zdjęcie główne opis
            products[i].Zdjecie_glowne_opis = products[i].Nazwa_produktu;
            // Zdjęcia dodatkowe
            let Zdjecie = [];
            if (photosArray.length > 1) {
              for (let i = 1; i < photosArray.length; i++) {
                Zdjecie.push({ Zdjecie: { Zdjecie_link: photosArray[i] } });
              }
              products[i].Zdjecia_dodatkowe = Zdjecie;
              delete products[i].image2;
            } else {
              delete products[i].image2;
            }
            // Kategoria
            /*
                        products[i].Kategoria = {
                          __cdata: ["OSTATNIO DODANE/NIESKLASYFIKOWANE"]
                        };
                        */
            if (
              products[i].opis[0].replace(/(?:\\[rn])+/g, "").trim().length ===
              0
            ) {
              products[i].Opis = {
                __cdata: [],
              };
              delete products[i].opis;
            } else {
              products[i].Opis = {
                __cdata: [
                  products[i].opis[0].replace(/(?:\\[rn])+/g, "").trim(),
                ],
              };
              delete products[i].opis;
            }
            names.push(nazwaProduktu);
            urls.push(zdjeciaProduktu[0]);
            for (let k = 0; k < urls.length; k++) {
              if (i === k) {
                products[i].Opis.__cdata.unshift(
                  `<a href="/images/${
                    urls[k] !== undefined ? urls[k].slice(22) : ""
                  }" target="_blank"><img alt=${nazwaProduktu} src="/images/${
                    urls[k] !== undefined ? urls[k].slice(22) : ""
                  }" width = "300px" /></a > <br />`
                );
              }
            }
            for (let k = 0; k < names.length; k++) {
              if (i === k) {
                products[i].Opis.__cdata.unshift(`<b>${names[i]}</b><br />`);
              }
            }
            let desc1 = products[i].Opis.__cdata[0];
            let desc2 = products[i].Opis.__cdata[1];
            let desc3 = products[i].Opis.__cdata[2];
            if (desc3 === undefined) {
              desc3 = "";
            } else {
              desc3 = products[i].Opis.__cdata[2];
            }
            let descResult = "";
            descResult = desc1.concat(desc2, desc3);
            products[i].Opis = {
              __cdata: [descResult],
            };
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
            `./client/src/outputFiles/fhsahsproducts-${userId}.xml`,
            finalXML,
            (err) => {
              if (err) {
                console.log("Nie udało się zapisać pliku", err);
              } else {
                console.log("Plik został zapisany :)");
                uploadFileToFTP(
                  `./client/src/outputFiles/fhsahsproducts-${userId}.xml`,
                  `public_html/import/fhsahsproducts-${userId}.xml`
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
