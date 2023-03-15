module.exports = function(req, res, db, data, result) {
    db.collection('ampPolska').insertOne({
        productsApi: data.productsApi,
        qtyApi: data.qtyApi,
        userID: result[0]._id
      }, (error, result) => {
        if (error) {
          res.send("Nie udało się dodać danych API integratora AMP Polska")
          console.log("Nie udało się dodać danych API integratora AMP Polska", error)
        } else {
          res.send("Dane API AMP Polska dodane pomyślnie")
          console.log("Dane API AMP Polska dodane pomyślnie")
        }
      });
};