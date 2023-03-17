module.exports = function (res, ampPolska, result) {
  ampPolska
    .find({
      userID: result[0]._id,
    })
    .toArray((error, result) => {
      if (error) {
        res.send("Nie udało się pobrać informacji z bazy danych");
        console.log("Nie udało się pobrać informacji z bazy danych", error);
      } else {
        if (result.length === 0) {
          res.send(
            "Ten użytkownik nie ma dodanego integratora Shopgold AMP Polska"
          );
          console.log(
            "Ten użytkownik nie ma dodanego integratora Shopgold AMP Polska"
          );
        }
        if (result.length === 1) {
          res.send({
            productsApi: result[0].productsApi,
            qtyApi: result[0].qtyApi,
            isJoined: true,
          });
        }
      }
    });
};
