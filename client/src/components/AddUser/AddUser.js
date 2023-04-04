import Input from "../Input";
import Button from "../Button";

import Header from "../Header";
import AppState from "../../hooks/AppState";
import useAddUserHook from "../../hooks/useAddUserHook";
import useInputChangeHook from "../../hooks/useInputChangeHook";

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
  } = AppState();
  const { addUser } = useAddUserHook();
  const { handleChange } = useInputChangeHook();

  return (
    <div className="main-container">
      <Header />
      <div className="sign-up-form-container sign-in-and-sign-up-form-container">
        <div className="sign-up-form-wrapper sign-in-and-sign-up-form-wrapper">
          <div className="sign-up-label sign-in-and-sign-up-label">
            <h3>Sign Up</h3>
          </div>
          <div className="sign-up-form sign-in-and-sign-up-form">
            <form onSubmit={(e) => addUser(e)}>
              <Input
                data={{
                  placeholder: "Company",
                  name: "company",
                  type: "text",
                  value: inputValue.company,
                  error: companyError,
                  handleChange,
                  autoComplete: "off",
                }}
              />
              <Input
                data={{
                  placeholder: "NIP",
                  name: "nip",
                  type: "text",
                  value: inputValue.nip,
                  error: nipError,
                  handleChange,
                  autoComplete: "off",
                }}
              />
              <Input
                data={{
                  placeholder: "Name",
                  name: "name",
                  type: "text",
                  value: inputValue.name,
                  error: nameError,
                  handleChange,
                  autoComplete: "off",
                }}
              />
              <Input
                data={{
                  placeholder: "Surname",
                  name: "surname",
                  type: "text",
                  value: inputValue.surname,
                  error: surnameError,
                  handleChange,
                  autoComplete: "off",
                }}
              />
              <Input
                data={{
                  placeholder: "Email",
                  name: "email",
                  type: "text",
                  value: inputValue.email,
                  error: emailError,
                  handleChange,
                  autoComplete: "off",
                }}
              />
              <Input
                data={{
                  placeholder: "Password",
                  name: "password",
                  type: "password",
                  value: inputValue.password,
                  error: passwordError,
                  handleChange,
                  autoComplete: "off",
                }}
              />
              <Input
                data={{
                  placeholder: "Password",
                  name: "password2",
                  type: "password",
                  value: inputValue.password2,
                  error: password2Error,
                  handleChange,
                  autoComplete: "off",
                }}
              />
              <Button label="Sign Up" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;

/*
import React from "react";

import AppState from "../../hooks/AppState";
import useInputChangeHook from "../../hooks/useInputChangeHook";
import useAddUserHook from "../../hooks/useAddUserHook";

const AddUser = () => {
  const {
    inputValue,
    nameError,
    surnameError,
    emailError,
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
          <form onSubmit={(e) => addUser(e)}>
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
