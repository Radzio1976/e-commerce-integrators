import { useNavigate } from "react-router-dom";
import AppState from "../../hooks/AppState";
import useLogoutHook from "../../hooks/useLogoutHook";

const Header = () => {
  const navigate = useNavigate();
  const { mainMenu, isAuth } = AppState();
  const { logout } = useLogoutHook();

  return (
    <div className="header">
      <header>
        <div className="logo-container">
          <h1 onClick={() => navigate("/")}>Logo</h1>
        </div>
        <div className="menu-container">
          <ul>
            {mainMenu.map((menuEl, i) => {
              return (
                <>
                  {isAuth && menuEl.url === "/admin" ? null : (
                    <li onClick={() => navigate(menuEl.url)}>{menuEl.name}</li>
                  )}
                </>
              );
            })}
            {isAuth ? (
              <li onClick={() => logout()} className="logout-button">
                Logout
              </li>
            ) : null}
            {isAuth ? (
              <li
                className="menu-container-li-start-train"
                onClick={() => navigate("/admin/shopgold-amppolska")}
              >
                Admin
              </li>
            ) : null}
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;
