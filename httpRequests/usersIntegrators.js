module.exports = function(req, res, db) {
    const currentUser = req.body.currentUser;
    let userIntegrators = [];
    
    db.collection('users').find({
      email: currentUser
    }).toArray((error, result) => {
      if (error) {
        res.send("Nie udało się znależć użytkownika")
        console.log("Nie udało się znależć użytkownika", error)
      } else {
        if (result.length === 1) {
          // Ta część kodu sprawdza czy aktualnie zalogowany użytkownik posiada integrator ShopGold-AMPPolska. Jeżeli tak to dodaje jego nazwę do tablicy userIntegrators.
          db.collection('ampPolska').find({
            userID: result[0]._id
          }).toArray((error, result) => {
            if (error) {
              res.send("Coś poszło nie tak")
              console.log("Coś poszło nie tak", error)
            } else {
              if (result.length === 1) {
                userIntegrators.push("ShopGold-AMPPolska")
                res.send(userIntegrators)
              }
            }
          })
          // Ta część kodu sprawdza czy aktualnie zalogowany użytkownik posiada integrator ShopGold-FHSahs. Jeżeli tak to dodaje jego nazwę do tablicy userIntegrators.
          db.collection('fhSahs').find({
            userID: result[0]._id
          }).toArray((error, result) => {
            if (error) {
              res.send("Coś poszło nie tak")
              console.log("Coś poszło nie tak", error)
            } else {
              if (result.length === 1) {
                userIntegrators.push("ShopGold-FHSahs")
                res.send(userIntegrators)
              }
            }
          })
        }
      }
    });
};