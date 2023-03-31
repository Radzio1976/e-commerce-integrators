const ObjectID = require("mongodb").ObjectId;

module.exports = function (req, res, ampPolska, data, result) {
  const id = data.userId;
  console.log(data);
  ampPolska.updateMany(
    { userID: new ObjectID(id) },
    {
      $set: {
        productsApi: data.changeProductsApi,
        qtyApi: data.changeQtyApi,
        pricesApi: data.changePricesApi,
      },
    },
    (error, result) => {
      if (error) {
        console.log(error);
        res.send({
          info: "Nie udało się zmienić API",
          error,
        });
      } else {
        ampPolska.find({}).toArray((error, result) => {
          if (error) {
            console.log(error);
            res.send({ error });
          } else {
            res.send({
              info: `Udało się zmienić API`,
              isJoined: true,
            });
          }
        });
      }
    }
  );
};
