import Axios from "axios";

import AppState from "./AppState";

const useLoginHook = () => {
  const { inputValue, setLoginError, setIsAuth, setCurrentUser } = AppState();

  const handleSubmit = (e, login) => {
    e.preventDefault();
    const user = {
      email: inputValue.email,
      password: inputValue.password,
    };
    Axios.post("/login", user)
      .then((res) => {
        console.log(res.data);
        if (res.data.isUserExist === "error") {
          setLoginError(res.data.info);
        }
        if (res.data.isUserExist === false) {
          setLoginError(res.data.info);
        }
        if (res.data.isUserExist === true) {
          login(inputValue.email);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const login = (email) => {
    localStorage.setItem("email", email);
    setIsAuth(true);
    setCurrentUser(email);
  };
  return { login, handleSubmit };
};

export default useLoginHook;
