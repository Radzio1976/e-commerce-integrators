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
};

const { useGlobalState } = createGlobalState(initialState);

const AppState = () => {
  const [inputValue, setInputValue] = useGlobalState("inputValue");

  return {
    inputValue,
    setInputValue,
  };
};

export default AppState;
