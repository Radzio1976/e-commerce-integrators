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
  } = AppState();
  const { handleChange } = useInputChangeHook();
  const {
    addApi,
    changeApi,
    getAMPProductsFile,
    getAMPUpdateFile,
    getAMPPricesFile,
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
        console.log(res.data);
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
          <div id="AddAmpApi">
            <form onSubmit={(e) => addApi(e)}>
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
              <label>
                Ceny produktów
                <input
                  type="text"
                  name="changePricesApi"
                  value={inputValue.changePricesApi}
                  onChange={(e) => handleChange(e)}
                ></input>
              </label>
              <button onClick={(e) => changeApi(e)}>Zmień</button>
            </form>
          </div>
        )}
        <div id="startUpdatesContainer">
          <button onClick={getAMPProductsFile}>
            Pobierz plik z bazą produktów
          </button>
          <button onClick={getAMPUpdateFile}>
            Pobierz plik aktualizacyjny
          </button>
          <button onClick={getAMPPricesFile}>Pobierz plik z cenami</button>
        </div>
      </div>
      <div className="control-panel-right-box">
        <div className="status-box">
          <p></p>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
