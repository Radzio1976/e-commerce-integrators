import { createGlobalState } from "react-hooks-global-state";

const initialState = {
  inputValue: {
    company: "",
    nip: "",
    name: "",
    surname: "",
    email: "",
    password: "",
    password2: "",
  },
  companyError: "",
  nipError: "",
  nameError: "",
  surnameError: "",
  emailError: "",
  passwordError: "",
  password2Error: "",
  registerError: "",
  registerSuccess: false,
  registerSuccessInfo: "",
  isAuth: false,
  currentUser: "",
  userIntegrators: [],
};

const { useGlobalState } = createGlobalState(initialState);

const AppState = () => {
  const [inputValue, setInputValue] = useGlobalState("inputValue");
  const [companyError, setCompanyError] = useGlobalState("companyError");
  const [nipError, setNipError] = useGlobalState("nipError");
  const [nameError, setNameError] = useGlobalState("nameError");
  const [surnameError, setSurnameError] = useGlobalState("surnameError");
  const [emailError, setEmailError] = useGlobalState("emailError");
  const [passwordError, setPasswordError] = useGlobalState("passwordError");
  const [password2Error, setPassword2Error] = useGlobalState("password2Error");
  const [registerError, setRegisterError] = useGlobalState("registerError");
  const [registerSuccess, setRegisterSuccess] =
    useGlobalState("registerSuccess");
  const [registerSuccessInfo, setRegisterSuccessInfo] = useGlobalState(
    "registerSuccessInfo"
  );
  const [isAuth, setIsAuth] = useGlobalState("isAuth");
  const [currentUser, setCurrentUser] = useGlobalState("currentUser");
  const [userIntegrators, setUserIntegrators] =
    useGlobalState("userIntegrators");

  return {
    inputValue,
    setInputValue,
    companyError,
    setCompanyError,
    nipError,
    setNipError,
    nameError,
    setNameError,
    surnameError,
    setSurnameError,
    emailError,
    setEmailError,
    passwordError,
    setPasswordError,
    password2Error,
    setPassword2Error,
    registerError,
    setRegisterError,
    registerSuccess,
    setRegisterSuccess,
    registerSuccessInfo,
    setRegisterSuccessInfo,
    isAuth,
    setIsAuth,
    currentUser,
    setCurrentUser,
    userIntegrators,
    setUserIntegrators,
  };
};

export default AppState;
