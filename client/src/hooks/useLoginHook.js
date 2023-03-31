import Axios from "axios";

import AppState from "./AppState";

const useLoginHook = () => {
  const { inputValue, setLoginError, setIsAuth, setCurrentUser, setUserId } =
    AppState();

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
          login(inputValue.email, res.data.userId);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const login = (email, userId) => {
    localStorage.setItem("email", email);
    localStorage.setItem("userId", userId);
    setIsAuth(true);
    setCurrentUser(email);
    setUserId(userId);
  };
  return { login, handleSubmit };
};

export default useLoginHook;
