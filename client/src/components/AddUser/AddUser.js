import React from "react";
import { withRouter } from "react-router-dom";
import "./AddUser.css";

import AppState from "../../hooks/AppState";
import useInputChangeHook from "../../hooks/useInputChangeHook";
import useAddUserHook from "../../hooks/useAddUserHook";

const AddUser = () => {
  const {
    inputValue,
    companyError,
    nipError,
    nameError,
    surnameError,
    emailError,
    passwordError,
    password2Error,
    registerSuccess,
    registerError,
    registerSuccessInfo,
  } = AppState();
  const { handleChange } = useInputChangeHook();
  const { addUser } = useAddUserHook();
  console.log(inputValue);

  return (
    <div id="AddUser">
      {!registerSuccess ? (
        <div className="add-user-form">
          <form onSubmit={addUser}>
            <label>
              Nazwa firmy:
              <input
                type="text"
                name="company"
                value={inputValue.company}
                onChange={(e) => handleChange(e)}
              ></input>
            </label>
            <label>
              NIP:
              <input
                type="text"
                name="nip"
                value={inputValue.nip}
                onChange={(e) => handleChange(e)}
              ></input>
            </label>
            <label>
              Imię:
              <input
                type="text"
                name="name"
                value={inputValue.name}
                onChange={(e) => handleChange(e)}
              ></input>
            </label>
            <p>{nameError}</p>
            <label>
              Nazwisko:
              <input
                type="text"
                name="surname"
                value={inputValue.surname}
                onChange={(e) => handleChange(e)}
              ></input>
            </label>
            <p>{surnameError}</p>
            <label>
              Email:
              <input
                type="text"
                name="email"
                value={inputValue.email}
                onChange={(e) => handleChange(e)}
              ></input>
            </label>
            <p>{emailError}</p>
            <label>
              Hasło:
              <input
                type="password"
                name="password"
                value={inputValue.password}
                onChange={(e) => handleChange(e)}
              ></input>
            </label>
            <label>
              Powtórz hasło:
              <input
                type="password"
                name="password2"
                value={inputValue.password2}
                onChange={(e) => handleChange(e)}
              ></input>
            </label>
            <p>{password2Error}</p>
            <button type="submit">Zarejestruj użytkownika</button>
          </form>
          <h5>{registerError}</h5>
        </div>
      ) : (
        <div className="add-user-form-success">
          <h1>{registerSuccessInfo}</h1>
          <button onClick={() => this.props.history.push("/login")}>
            Zaloguj
          </button>
        </div>
      )}
    </div>
  );
};

export default AddUser;

/*
import React from "react";
import { withRouter } from "react-router-dom";
import "./AddUser.css";

import AppState from "../../hooks/AppState";
import useInputChangeHook from "../../hooks/useInputChangeHook";
import useAddUserHook from "../../hooks/useAddUserHook";

const AddUser = () => {
  const {
    inputValue,
    companyError,
    nipError,
    nameError,
    surnameError,
    emailError,
    passwordError,
    password2Error,
    registerSuccess,
    registerError,
    registerSuccessInfo,
  } = AppState();
  const { handleChange } = useInputChangeHook();
  const { addUser } = useAddUserHook();
  console.log(inputValue);

  return (
    <div id="AddUser">
      {!registerSuccess ? (
        <div className="add-user-form">
          <form onSubmit={addUser}>
            <label>
              Nazwa firmy:
              <input
                type="text"
                name="company"
                value={inputValue.company}
                onChange={(e) => handleChange(e)}
              ></input>
            </label>
            <label>
              NIP:
              <input
                type="text"
                name="nip"
                value={inputValue.nip}
                onChange={(e) => handleChange(e)}
              ></input>
            </label>
            <label>
              Imię:
              <input
                type="text"
                name="name"
                value={inputValue.name}
                onChange={(e) => handleChange(e)}
              ></input>
            </label>
            <p>{nameError}</p>
            <label>
              Nazwisko:
              <input
                type="text"
                name="surname"
                value={inputValue.surname}
                onChange={(e) => handleChange(e)}
              ></input>
            </label>
            <p>{surnameError}</p>
            <label>
              Email:
              <input
                type="text"
                name="email"
                value={inputValue.email}
                onChange={(e) => handleChange(e)}
              ></input>
            </label>
            <p>{emailError}</p>
            <label>
              Hasło:
              <input
                type="password"
                name="password"
                value={inputValue.password}
                onChange={(e) => handleChange(e)}
              ></input>
            </label>
            <label>
              Powtórz hasło:
              <input
                type="password"
                name="password2"
                value={inputValue.password2}
                onChange={(e) => handleChange(e)}
              ></input>
            </label>
            <p>{password2Error}</p>
            <button type="submit">Zarejestruj użytkownika</button>
          </form>
          <h5>{registerError}</h5>
        </div>
      ) : (
        <div className="add-user-form-success">
          <h1>{registerSuccessInfo}</h1>
          <button onClick={() => this.props.history.push("/login")}>
            Zaloguj
          </button>
        </div>
      )}
    </div>
  );
};

export default AddUser;


*/
