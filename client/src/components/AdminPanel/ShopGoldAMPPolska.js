import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppState from "../../hooks/AppState";

import Header from "../Header";
import LeftMenu from "./LeftMenu";
import ControlPanel from "./ControlPanel";

const ShopGoldAMPPolska = (props) => {
  const { isAuth, currentUser } = AppState();
  const navigate = useNavigate();
  const pathName = "/shopGold-ampPolska";
  const data = {
    action: "getAmpApi",
    currentUser: currentUser,
  };
  const addApiAction = "addAmpApi";
  const changeApiAction = "changeAmpApi";
  const getProductsFileAction = "getAMPProductsFile";
  const getProductsAvailibilityFileAction = "getAMPUpdateFile";
  const getPricesFileAction = "getAMPPricesFile";

  // useEffect(() => {
  //   if (!isAuth) {
  //     navigate("/");
  //   }
  // }, []);

  return (
    <div className="admin-panel-main-container">
      <Header />
      <div className="shopgold-amppolska-page-container shopgold-amppolska-main-container">
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

export default ShopGoldAMPPolska;
