import React from "react";
import { useNavigate } from "react-router-dom";

import AppState from "../../hooks/AppState";
import useLogoutHook from "../../hooks/useLogoutHook";

const Nav = () => {
  const navigate = useNavigate();
  const { isAuth, currentUser } = AppState();
  const { logout } = useLogoutHook();
  return (
    <div id="Nav">
      <div className="logo">
        <h3>Logo</h3>
      </div>
      <div className="logged-in">
        {isAuth ? <h5>Zalogowany: {currentUser}</h5> : ""}
      </div>
      <div className="nav-bar">
        {isAuth ? (
          <>
            <button onClick={() => logout()}>Wyloguj się</button>
            <button onClick={() => navigate("/admin")}>Admin</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")}>Zaloguj</button>
            <button onClick={() => navigate("/add-user")}>
              Zarejestruj się
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Nav;
