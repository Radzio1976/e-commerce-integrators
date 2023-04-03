import { useEffect } from "react";
import Axios from "axios";

import AppState from "../../hooks/AppState";
import useInputChangeHook from "../../hooks/useInputChangeHook";
import useAMPHook from "../../hooks/useAMPHook";
const ControlPanel = () => {
  const {
    inputValue,
    setInputValue,
    isJoined,
    setIsJoined,
    currentUser,
    userId,
    isAuth,
    setCurrentUser,
    setUserId,
    statusBoxText,
  } = AppState();
  const { handleChange } = useInputChangeHook();
  const {
    addApi,
    changeApi,
    getProductsFile,
    getProductsAvailibilityFile,
    getPricesFile,
  } = useAMPHook();

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    setCurrentUser(localStorage.getItem("email"));
    const data = {
      action: "getAmpApi",
      currentUser: currentUser,
    };
    Axios.post("/shopGold-ampPolska", data)
      .then((res) => {
        setInputValue({
          ...inputValue,
          changeProductsApi: res.data.productsApi,
          changeQtyApi: res.data.qtyApi,
          changePricesApi: res.data.pricesApi,
        });
        setIsJoined(res.data.isJoined);
      })
      .catch((error) => {
        console.log("Nie udało się połączyć z serwerem", error);
      });
  }, [currentUser]);

  return (
    <div className="control-panel-container">
      <div className="control-panel-left-box">
        {!isJoined ? (
          <div className="add-api-container">
            <form
              onSubmit={(e) => addApi(e, "addAmpApi", "/shopgold-amppolska")}
            >
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
              <label>
                Adres API pliku z cenami
                <input
                  type="text"
                  name="pricesApi"
                  value={inputValue.pricesApi}
                  onChange={(e) => handleChange(e)}
                ></input>
              </label>
              <button>Zapisz</button>
            </form>
          </div>
        ) : (
          <div className="change-api-container">
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
              <label>
                Ceny produktów
                <input
                  type="text"
                  name="changePricesApi"
                  value={inputValue.changePricesApi}
                  onChange={(e) => handleChange(e)}
                ></input>
              </label>
              <button
                onClick={(e) =>
                  changeApi(e, "changeAmpApi", "/shopgold-amppolska")
                }
              >
                Zmień
              </button>
            </form>
          </div>
        )}
        <div className="start-updates-container">
          <button
            onClick={() =>
              getProductsFile("getAMPProductsFile", "/shopgold-amppolska")
            }
          >
            Pobierz plik z bazą produktów
          </button>
          <button
            onClick={() =>
              getProductsAvailibilityFile(
                "getAMPUpdateFile",
                "/shopgold-amppolska"
              )
            }
          >
            Pobierz plik aktualizacyjny
          </button>
          <button
            onClick={() =>
              getPricesFile("getAMPPricesFile", "/shopgold-amppolska")
            }
          >
            Pobierz plik z cenami
          </button>
        </div>
      </div>
      <div className="control-panel-right-box">
        <div className="status-box">
          <p>{statusBoxText}</p>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
