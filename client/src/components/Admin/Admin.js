import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../Header";
import AppState from "../../hooks/AppState";
import useLoginHook from "../../hooks/useLoginHook";
import useInputChangeHook from "../../hooks/useInputChangeHook";

import Input from "../Input";
import Button from "../Button";

const Admin = () => {
  const navigate = useNavigate();
  const { isAuth, inputValue, emailError, passwordError } = AppState();
  const { handleSubmit, login } = useLoginHook();
  const { handleChange } = useInputChangeHook();

  useEffect(() => {
    if (isAuth) {
      navigate("/");
    }
  });

  return (
    <div className="main-container">
      <Header />
      <div className="sign-in-form-container sign-in-and-sign-up-form-container">
        <div className="sign-in-form-wrapper sign-in-and-sign-up-form-wrapper">
          <div className="sign-in-label sign-in-and-sign-up-label">
            <h3>Sign In</h3>
          </div>
          <div className="sign-in-form sign-in-and-sign-up-form">
            <form onSubmit={(e) => handleSubmit(e, login)}>
              <Input
                data={{
                  placeholder: "Email",
                  name: "email",
                  type: "text",
                  value: inputValue.email,
                  error: emailError,
                  handleChange,
                  autoComplete: "on",
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
                  autoComplete: "on",
                }}
              />
              <Button label="Sign In" />
            </form>
            <p>
              Don't have an account?
              <span onClick={() => navigate("/sign-up")}>Sign up</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
