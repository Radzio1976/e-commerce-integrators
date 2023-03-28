import Axios from "axios";

import AppState from "./AppState";

const useAddUserHook = () => {
  const {
    inputValue,
    setNameError,
    setSurnameError,
    setEmailError,
    setPassword2Error,
    setRegisterError,
    setRegisterSuccess,
    setRegisterSuccessInfo,
  } = AppState();
  const addUser = (e) => {
    e.preventDefault();
    let isValid = true;
    if (inputValue.name.length < 5) {
      setNameError("Pole imię musi mieć conajmniej 5 znaków");
      isValid = false;
    }
    if (inputValue.surname.length < 5) {
      setSurnameError("Pole nazwisko musi mieć conajmniej 5 znaków");
      isValid = false;
    }
    if (inputValue.email.includes("@") === false) {
      setEmailError("Pole email musi zawierać znak @");
      isValid = false;
    }
    if (
      inputValue.password.length < 5 ||
      inputValue.password !== inputValue.password2
    ) {
      setPassword2Error("Hasło nie jest takie samo");
      isValid = false;
    }
    if (isValid) {
      let user = {
        company: inputValue.company,
        nip: inputValue.nip,
        name: inputValue.name,
        surname: inputValue.surname,
        email: inputValue.email,
        password: inputValue.password,
      };

      Axios.post("/addUser", user)
        .then((res) => {
          console.log(res.data);
          if (res.data.addUser === "error") {
            setRegisterError(res.data.info);
          }
          if (res.data.addUser === false) {
            setRegisterError(res.data.info);
          }
          if (res.data.addUser === true) {
            setRegisterSuccess(true);
            setRegisterSuccessInfo(res.data.info);
          }
        })
        .catch((err) => {
          console.log("Nie udało się dodać użytkownika do bazy danych", err);
        });
    }
  };
  return { addUser };
};
export default useAddUserHook;
