import AppState from "./AppState";

const useInputChangeHook = () => {
  const { inputValue, setInputValue } = AppState();
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };
  return { handleChange };
};

export default useInputChangeHook;
