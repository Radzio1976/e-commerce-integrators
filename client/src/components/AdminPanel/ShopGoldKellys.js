import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppState from "../../hooks/AppState";

import Header from "../Header";
import LeftMenu from "./LeftMenu";
import ControlPanel from "./ControlPanel";

const ShopGoldKellys = () => {
  const { isAuth, currentUser } = AppState();
  const navigate = useNavigate();
  const pathName = "/shopGold-kellys";
  const data = {
    action: "getKellysApi",
    currentUser: currentUser,
  };
  const addApiAction = "addKellysApi";
  const changeApiAction = "changeKellysApi";
  const getProductsFileAction = "getKellysProductsFile";
  const getProductsAvailibilityFileAction = "getKellysUpdateFile";
  const getPricesFileAction = "getKellysPricesFile";

  // useEffect(() => {
  //   if (!isAuth) {
  //     navigate("/");
  //   }
  // });

  return (
    <div className="admin-panel-main-container">
      <Header />
      <div className="shopgold-kellys-page-container shopgold-kellys-main-container">
        <LeftMenu />
        <ControlPanel
          pathName={pathName}
          data={data}
          addApiAction={addApiAction}
          changeApiAction={changeApiAction}
          getProductsFileAction={getProductsFileAction}
          getProductsAvailibilityFileAction={getProductsAvailibilityFileAction}
          getPricesFileAction={getPricesFileAction}
        />
      </div>
    </div>
  );
};

export default ShopGoldKellys;
