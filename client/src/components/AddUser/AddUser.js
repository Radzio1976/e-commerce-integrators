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
