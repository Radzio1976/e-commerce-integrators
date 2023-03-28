import React, { useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import "./ShopGoldAmp.css";

import AppState from "../../hooks/AppState";
import useAMPHook from "../../hooks/useAMPHook";
import useInputChangeHook from "../../hooks/useInputChangeHook";
const ShopgoldAmp = () => {
  const {
    inputValue,
    setInputValue,
    setUserId,
    currentUser,
    setCurrentUser,
    isJoined,
    setIsJoined,
    isAuth,
  } = AppState();
  const { addApi, getAMPProductsFile, getAMPUpdateFile, getAMPPricesFile } =
    useAMPHook();
  const { handleChange } = useInputChangeHook();

  useEffect(() => {
    //setUserId(localStorage.getItem("userId"));
    //setCurrentUser(localStorage.getItem("email"));
    const data = {
      action: "getAmpApi",
      currentUser: currentUser,
    };
    axios
      .post("/shopGold-ampPolska", data)
      .then((res) => {
        console.log(res.data);
        setInputValue({
          ...inputValue,
          changeProductsApi: res.data.productsApi,
          changeQtyApi: res.data.qtyApi,
        });
        setIsJoined(res.data.isJoined);
      })
      .catch((error) => {
        console.log("Nie udało się połączyć z serwerem", error);
      });
  }, []);

  return isAuth ? (
    <div id="ShopgoldAmp">
      {!isJoined ? (
        <div id="AddAmpApi">
          <form onSubmit={addApi}>
            <label>
              Adres API pliku z produktami
              <input
                type="text"
                name="productsApi"
                value={inputValue.productsApi}
                onChange={(e) => handleChange(e)}
              ></input>
            </label>
            <label>
              Adres API pliku ze stanami magazynowymi
              <input
                type="text"
                name="qtyApi"
                value={inputValue.qtyApi}
                onChange={(e) => handleChange(e)}
              ></input>
            </label>
            <button>Zapisz</button>
          </form>
        </div>
      ) : (
        <div id="ChangeAmpApi">
          <form>
            <label>
              Podstawowy plik z produktami
              <input
                type="text"
                name="changeProductsApi"
                value={inputValue.changeProductsApi}
                onChange={(e) => handleChange(e)}
              ></input>
            </label>
            <label>
              Stany produktów
              <input
                type="text"
                name="changeQtyApi"
                value={inputValue.changeQtyApi}
                onChange={(e) => handleChange(e)}
              ></input>
            </label>
            <button>Zmień</button>
          </form>
        </div>
      )}
      <div id="getAmpDataButtons">
        <button onClick={getAMPProductsFile}>
          Pobierz plik z bazą produktów
        </button>
        <button onClick={getAMPUpdateFile}>Pobierz plik aktualizacyjny</button>
        <button onClick={getAMPPricesFile}>Pobierz plik z cenami</button>
      </div>
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default ShopgoldAmp;
