import React from "react";
import { Navigate } from "react-router-dom";

import AppState from "../../hooks/AppState";
import useLoginHook from "../../hooks/useLoginHook";
import useInputChangeHook from "../../hooks/useInputChangeHook";

const Login = () => {
  const { isAuth, inputValue, loginError } = AppState();
  const { login, handleSubmit } = useLoginHook();
  const { handleChange } = useInputChangeHook();

  return isAuth ? (
    <Navigate to="/" />
  ) : (
    <div id="Login">
      <h3>Zaloguj się</h3>
      <form onSubmit={(e) => handleSubmit(e, login)}>
        <label>
          Email:
          <input
            type="text"
            name="email"
            value={inputValue.email}
            onChange={(e) => handleChange(e)}
          ></input>
        </label>
        <label>
          Hasło
          <input
            type="password"
            name="password"
            value={inputValue.password}
            onChange={(e) => handleChange(e)}
          ></input>
        </label>
        <button>Zaloguj</button>
        <p>{loginError}</p>
      </form>
    </div>
  );
};

export default Login;
