import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppState from "../../hooks/AppState";

import Header from "../Header";
import LeftMenu from "./LeftMenu";
import ControlPanel from "./ControlPanel";

const ShopGoldAMPPolska = () => {
  const { isAuth } = AppState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
  });

  return (
    <div className="admin-panel-main-container">
      <Header />
      <div className="shopgold-amppolska-page-container shopgold-amppolska-main-container">
        <LeftMenu />
        <ControlPanel />
      </div>
    </div>
  );
};

export default ShopGoldAMPPolska;
