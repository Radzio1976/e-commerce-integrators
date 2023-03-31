module.exports = function (req, res, ampPolska, data, result) {
  ampPolska.insertOne(
    {
      productsApi: data.productsApi,
      qtyApi: data.qtyApi,
      pricesApi: data.pricesApi,
      userID: result[0]._id,
    },
    (error, result) => {
      if (error) {
        res.send("Nie udało się dodać danych API integratora AMP Polska");
        console.log(
          "Nie udało się dodać danych API integratora AMP Polska",
          error
        );
      } else {
        res.send({ isJoined: true });
        console.log("Dane API AMP Polska dodane pomyślnie");
      }
    }
  );
};
