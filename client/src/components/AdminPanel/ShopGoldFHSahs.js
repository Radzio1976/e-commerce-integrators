import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppState from "../../hooks/AppState";

import Header from "../Header";
import LeftMenu from "./LeftMenu";
import ControlPanel from "./ControlPanel";

const ShopGoldFHSahs = () => {
  const { isAuth, currentUser } = AppState();
  const navigate = useNavigate();
  const pathName = "/shopGold-fhSahs";
  const data = {
    action: "getFHSahsApi",
    currentUser: currentUser,
  };
  const addApiAction = "addFHSahsApi";
  const changeApiAction = "changeFHSahsApi";
  const getProductsFileAction = "getFHSahsProductsFile";
  const getProductsAvailibilityFileAction = "getFHSUpdateFile";
  const getPricesFileAction = "getFHSPricesFile";

  // useEffect(() => {
  //   if (!isAuth) {
  //     navigate("/");
  //   }
  // });

  return (
    <div className="admin-panel-main-container">
      <Header />
      <div className="shopgold-fhsahs-page-container shopgold-fhsahs-main-container">
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

export default ShopGoldFHSahs;
