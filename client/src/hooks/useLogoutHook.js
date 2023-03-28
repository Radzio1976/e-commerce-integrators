import AppState from "./AppState";
const useLogoutHook = () => {
  const { setIsAuth, setCurrentUser } = AppState();

  const logout = () => {
    localStorage.removeItem("email");
    setIsAuth(false);
    setCurrentUser("");
  };
  return { logout };
};

export default useLogoutHook;
