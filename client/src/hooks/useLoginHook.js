import AppState from "./AppState";

const useLoginHook = () => {
  const { setIsAuth, setCurrentUser } = AppState();

  const login = (email) => {
    localStorage.setItem("email", email);
    setIsAuth(true);
    setCurrentUser(email);
  };
  return { login };
};

export default useLoginHook;
