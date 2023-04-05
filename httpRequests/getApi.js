module.exports = function (res, collection, result) {
  collection
    .find({
      userID: result[0]._id,
    })
    .toArray((error, result) => {
      if (error) {
        res.send("Nie udało się pobrać informacji z bazy danych");
        console.log("Nie udało się pobrać informacji z bazy danych", error);
      } else {
        if (result.length === 0) {
          res.send("Ten użytkownik nie ma dodanego integratora");
          console.log("Ten użytkownik nie ma dodanego integratora");
        }
        if (result.length === 1) {
          console.log(res.data);
          res.send({
            productsApi: result[0].productsApi,
            qtyApi: result[0].qtyApi,
            pricesApi: result[0].pricesApi,
            isJoined: true,
          });
        }
      }
    });
};
