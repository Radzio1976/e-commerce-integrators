import { createGlobalState } from "react-hooks-global-state";

const initialState = {
  mainMenu: [
    {
      url: "/",
      name: "home",
    },
    {
      url: "/about",
      name: "about",
    },
    {
      url: "/admin",
      name: "sign in",
    },
    {
      url: "/add-user",
      name: "sign up",
    },
    {
      url: "/contact",
      name: "contact",
    },
  ],
  adminPanelMenu: [
    {
      url: "/admin/shopgold-amppolska",
      name: "AMP Polska",
    },
    {
      url: "/admin/shopgold-fhsahs",
      name: "FH Sahs",
    },
    {
      url: "/admin/shopgold-kellys",
      name: "Kellys",
    },
  ],
  inputValue: {
    company: "",
    nip: "",
    name: "",
    surname: "",
    email: "",
    password: "",
    password2: "",
    productsApi: "",
    qtyApi: "",
    pricesApi: "",
    changeProductsApi: "",
    changeQtyApi: "",
    changePricesApi: "",
  },
  companyError: "",
  nipError: "",
  nameError: "",
  surnameError: "",
  emailError: "",
  passwordError: "",
  password2Error: "",
  loginError: "",
  registerError: "",
  registerSuccess: false,
  registerSuccessInfo: "",
  isAuth: false,
  currentUser: "",
  userId: "",
  isJoined: false,
  userIntegrators: [],
  statusBoxText: "",
};

const { useGlobalState } = createGlobalState(initialState);

const AppState = () => {
  const [mainMenu, setMainMenu] = useGlobalState("mainMenu");
  const [adminPanelMenu, setAdminPanelMenu] = useGlobalState("adminPanelMenu");
  const [inputValue, setInputValue] = useGlobalState("inputValue");
  const [companyError, setCompanyError] = useGlobalState("companyError");
  const [nipError, setNipError] = useGlobalState("nipError");
  const [nameError, setNameError] = useGlobalState("nameError");
  const [surnameError, setSurnameError] = useGlobalState("surnameError");
  const [emailError, setEmailError] = useGlobalState("emailError");
  const [passwordError, setPasswordError] = useGlobalState("passwordError");
  const [password2Error, setPassword2Error] = useGlobalState("password2Error");
  const [loginError, setLoginError] = useGlobalState("loginError");
  const [registerError, setRegisterError] = useGlobalState("registerError");
  const [registerSuccess, setRegisterSuccess] =
    useGlobalState("registerSuccess");
  const [registerSuccessInfo, setRegisterSuccessInfo] = useGlobalState(
    "registerSuccessInfo"
  );
  const [isAuth, setIsAuth] = useGlobalState("isAuth");
  const [currentUser, setCurrentUser] = useGlobalState("currentUser");
  const [userId, setUserId] = useGlobalState("userId");
  const [isJoined, setIsJoined] = useGlobalState("isJoined");
  const [userIntegrators, setUserIntegrators] =
    useGlobalState("userIntegrators");
  const [statusBoxText, setStatusBoxText] = useGlobalState("statusBoxText");

  return {
    mainMenu,
    setMainMenu,
    adminPanelMenu,
    setAdminPanelMenu,
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
    loginError,
    setLoginError,
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
    userId,
    setUserId,
    isJoined,
    setIsJoined,
    userIntegrators,
    setUserIntegrators,
    statusBoxText,
    setStatusBoxText,
  };
};

export default AppState;
