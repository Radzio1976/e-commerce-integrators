module.exports = function(req, res, db) {
    const user = req.body;

    db.collection('users').find({
      email: user.email
    }).toArray((error, results) => {
      if (error) {
        res.send({ addUser: "error", info: "Nie udało się pobrać danych na temat tego użytkownika" })
        console.log("Nie udało się pobrać danych na temat tego użytkownika")
      } else {
        if (results.length === 0) {
          db.collection('users').insertOne({
            company: user.company,
            nip: user.nip,
            name: user.name,
            surname: user.surname,
            email: user.email,
            password: user.password
          }, (error, result) => {
            if (error) {
              res.send({ addUser: "error", info: "Nie udało się dodać użytkownika" });
              console.log("Nie udało się dodać użytkownika", error)
            } else {
              res.send({ addUser: true, info: "Rejestracja przebiegła pomyślnie" });
              console.log(result.ops)
            }
          })
        } else {
          res.send({ addUser: false, info: "Użytkownik o podanym adresie e-mail już istnieje w naszej bazie danych" });
          console.log("Użytkownik o podanym adresie e-mail już istnieje w naszej bazie danych")
        }
      }
    })
}