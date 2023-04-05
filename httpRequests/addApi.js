module.exports = function (req, res, collection, data, result) {
  collection.insertOne(
    {
      productsApi: data.productsApi,
      qtyApi: data.qtyApi,
      pricesApi: data.pricesApi,
      userID: result[0]._id,
    },
    (error, result) => {
      if (error) {
        res.send("Nie udało się dodać danych API");
        console.log("Nie udało się dodać danych API", error);
      } else {
        res.send({ isJoined: true });
        console.log("Dane API dodane pomyślnie");
      }
    }
  );
};
