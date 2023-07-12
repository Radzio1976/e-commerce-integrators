import { useNavigate } from "react-router-dom";

import AppState from "../../hooks/AppState";

const LeftMenu = () => {
  const currentPathName = window.location.pathname;
  const navigate = useNavigate();
  const { adminPanelMenu } = AppState();
  return (
    <div className="left-menu-container">
      <div className="left-menu-wrapper">
        <h3>Menu</h3>
        <ul>
          {adminPanelMenu.map((menuEl, i) => {
            return (
              <li
                className={currentPathName === menuEl.url ? "li-active" : ""}
                key={i}
                onClick={() => navigate(`${menuEl.url}`)}
              >
                {menuEl.name}
              </li>
            );
          })}
          <li>Aktualizuj wszystko</li>
        </ul>
      </div>
    </div>
  );
};

export default LeftMenu;
