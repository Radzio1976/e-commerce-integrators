const downloadFile = require("../utils/downloadFile");

module.exports = function (res, collection, result, fileName, xmlIntegrator) {
  collection.find({ userID: result[0]._id }).toArray((error, result) => {
    if (error) {
      console.log("Nie udało się pobrać informacji z bazy danych", error);
    } else {
      if (result.length === 0) {
        res.send(
          "Ten użytkownik nie ma dodanych adresów API Shopgold AMP Polska"
        );
        console.log(
          "Ten użytkownik nie ma dodanych adresów API Shopgold AMP Polska"
        );
      }
      if (result.length === 1) {
        const urlResult = result[0].productsApi;
        const userIdResult = result[0].userID;
        const inputFileName = `${fileName}-${userIdResult}.xml`;
        downloadFile(urlResult, userIdResult, xmlIntegrator, inputFileName);
      }
    }
  });
};
