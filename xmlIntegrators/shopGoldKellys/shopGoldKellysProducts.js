const fs = require("fs");
var parseString = require("xml2js").parseString;
const { toXML } = require("jstoxml");

const uploadFileToFTP = require("../../utils/uploadFileToFTP");

module.exports = function (userId) {
  fs.readFile(`./input/kellysproducts-${userId}.xml`, "utf8", (err, data) => {
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
            const vat = "23";
            const freeDelivery = "nie";
            const brand = "KELLYS";
            const shippingDate = "1-5 dni";
            const productCondition = "Nowy";
            const id = accessories[i]["g:id"][0].trim();
            const ean = accessories[i]["g:gtin"][0].trim();
            //const productGroup = accessories[i]["g:item_group_id"][0].trim();
            const title = accessories[i]["title"][0].trim();
            const price = accessories[i]["g:price"][0]
              .replace("PLN", "")
              .trim();
            const imageLink = accessories[i]["g:image_link"][0].trim();
            const descriptionTitle = `<b>${title}</b><br />`;
            const descriptionImage = `<a href="/images/${
              imageLink !== undefined ? imageLink.slice(32) : ""
            }" target="_blank"><img alt="${title}" src="/images/${
              imageLink !== undefined ? imageLink.slice(32) : ""
            }" width = "300px" /></a > <br />`;
            const kellysLogoImage = `<img alt="Kellys" src="/images/fotos/rowery/kellys/2018/kellys_logo.jpg" width="208px" /></a > <br />`;
            const description = accessories[i]["description"][0].trim();
            const category = accessories[i]["g:product_type"][0].trim();
            //const availability = accessories[i]["g:availability"][0].trim(); // availibolity = out of stock === quantity = "0"
            const quantity = accessories[i]["g:quantity"][0].trim();
            const shippingWeight = accessories[i]["g:shipping_weight"][0]
              .replace("kg", "")
              .trim();
            // const size =
            //   accessories[i]["g:size"] === undefined
            //     ? "no-size"
            //     : accessories[i]["g:size"][0].trim();
            // const color =
            //   accessories[i]["g:color"] === undefined
            //     ? "no-color"
            //     : accessories[i]["g:color"][0].trim();
            delete accessories[i]["g:availability"];
            delete accessories[i]["g:size"];
            delete accessories[i]["g:color"];
            delete accessories[i]["g:item_group_id"];

            /* Tworzy tag xml Nr_katalogowy oraz usuwa niepotrzebny tag pochodzący z pliku wchodzącego kellysInput.xml */
            accessories[i].Nr_katalogowy = {
              __cdata: [id],
            };
            delete accessories[i]["g:id"];

            /* Tworzy tag xml Kod ean oraz usuwa niepotrzebny tag pochodzący z pliku wchodzącego kellysInput.xml */
            if (ean.length === 0) {
              delete accessories[i]["g:gtin"];
            } else {
              accessories[i].Kod_ean = {
                __cdata: [ean],
              };
              delete accessories[i]["g:gtin"];
            }

            /* Tworzy tag xml Nazwa_produktu */
            accessories[i].Nazwa_produktu = {
              __cdata: [title],
            };

            // /* Tworzy tag xml Cena_poprzednia */
            // accessories[i].Cena_poprzednia = Number(price).toFixed(2);
            // delete accessories[i]["g:price"];

            /* Tworzy tag xml Cena_brutto */
            accessories[i].Cena_brutto = Number(price).toFixed(2);
            delete accessories[i]["g:price"];

            /* Tworzy tag xml Opis oraz usuwa niepotrzebny tag pochodzący z pliku wchodzącego kellysInput.xml */
            if (description.length === 0) {
              accessories[i].Opis = {
                __cdata: [],
              };
              delete accessories[i].description;
            } else {
              accessories[i].Opis = {
                __cdata: [
                  descriptionTitle +
                    descriptionImage +
                    description +
                    kellysLogoImage,
                ],
              };
              delete accessories[i].description;
            }

            /* Tworzy tag xml Kategoria oraz usuwa niepotrzebny tag pochodzący z pliku wchodzącego kellysInput.xml */
            accessories[i].Kategoria = {
              __cdata: [
                `OSTATNIO DODANE/${category.replace(" > ", "/").trim()}`,
              ],
            };
            delete accessories[i]["g:product_type"];

            /* Tworzy tag xml Zdjecie_glowne oraz usuwa niepotrzebny tag pochodzący z pliku wchodzącego kellysInput.xml */
            if (imageLink.length === 0) {
              delete accessories[i]["g:image_link"];
            } else {
              accessories[i].Zdjecie_glowne = imageLink;
              delete accessories[i]["g:image_link"];
            }

            /* Tworzy tag xml Zdjecie_glowne_opis */
            accessories[i].Zdjecie_glowne_opis = title;

            /* Tworzy tag xml Ilosc_produktow */
            accessories[i].Ilosc_produktow = Number(quantity).toFixed(2);
            delete accessories[i]["g:quantity"];

            accessories[i].Dostepnosc = {
              __cdata: [],
            };

            /* Tworzy tag xml Dostepnosc */
            if (Number(accessories[i].Ilosc_produktow) === 0) {
              accessories[i].Dostepnosc.__cdata = ["Wyprzedane"];
            } else if (
              Number(accessories[i].Ilosc_produktow) > 0 &&
              Number(accessories[i].Ilosc_produktow) < 6
            ) {
              accessories[i].Dostepnosc.__cdata = ["Na wyczerpaniu"];
            } else if (Number(accessories[i].Ilosc_produktow) > 5) {
              accessories[i].Dostepnosc.__cdata = ["Dostępny"];
            }

            // if (accessories[i].Dostepnosc.__cdata === "Dostępny") {
            //   counter++;
            //   console.log(counter);
            // }

            /* Tworzy tag xml Waga */
            accessories[i].Waga = shippingWeight;
            delete accessories[i]["g:shipping_weight"];

            /* Tworzy tag xml Podatek VAT */
            accessories[i].Podatek_Vat = vat;

            /* Tworzy tag xml Darmowa_dostawa */
            accessories[i].Darmowa_dostawa = freeDelivery;

            /* Tworzy tag xml Producent */
            accessories[i].Producent = {
              __cdata: [brand],
            };

            /* Tworzy tag xml Termin_wysylki */
            accessories[i].Termin_wysylki = {
              __cdata: [shippingDate],
            };

            /* Tworzy tag xml Stan_produktu */
            accessories[i].Stan_produktu = {
              __cdata: [productCondition],
            };

            /* Tworzy tag xml Status w zależności od tego czy cena jest różna od 0 */
            if (Number(price) === 0) {
              accessories[i].Status = "nie";
            } else {
              accessories[i].Status = "tak";
            }

            /* Tworzy tag xml Meta_tytul */
            accessories[i].Meta_tytul = {
              __cdata: [title],
            };

            /* Tworzy tag xml Meta_opis */
            accessories[i].Meta_opis = {
              __cdata: [title],
            };

            /* Tworzy tag xml Opis_krotki */
            accessories[i].Opis_krotki = {
              __cdata: [title],
            };

            /* Tworzy tag xml Meta_slowa */
            accessories[i].Meta_slowa = {
              __cdata: [
                `${brand}, akcesoria rowerowe, części rowerowe, ubrania rowerowe, sklep rowerowy, rowery akcesoria`,
              ],
            };
            delete accessories[i].title;

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
            `./client/src/outputFiles/kellysproducts-${userId}.xml`,
            finalXML,
            (err) => {
              if (err) {
                console.log("Nie udało się zapisać pliku", err);
              } else {
                console.log("Plik został zapisany :)");
                uploadFileToFTP(
                  `./client/src/outputFiles/kellysproducts-${userId}.xml`,
                  `public_html/import/kellysproducts-${userId}.xml`
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
