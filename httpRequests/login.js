module.exports = async function (req, res, usersdb) {
  const user = req.body;

  const result = await usersdb
    .find({
      email: user.email,
      password: user.password,
    })
    .toArray((error, results) => {
      if (error) {
        res.send({
          isUserExist: "error",
          info: "Nie udało się pobrać informacji o takim użytkowniku",
        });
        console.log("Nie udało się pobrać informacji o takim użytkowniku");
      } else {
        if (results.length === 1) {
          res.send({
            isUserExist: true,
            userId: results[0]._id,
            info: "Użytkownik zalogowany pomyślnie",
          });
          console.log("Użytkownik zalogowany pomyślnie");
        } else {
          res.send({
            isUserExist: false,
            info: "Niepoprawny adres email lub hasło",
          });
          console.log("Niepoprawny adres email lub hasło");
        }
      }
    });
};
