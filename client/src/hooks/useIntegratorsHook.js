import Axios from "axios";
import AppState from "./AppState";

const useAMPHook = () => {
  const { currentUser, userId, inputValue, setIsJoined, setStatusBoxText } =
    AppState();
  const addApi = (e, action, pathName) => {
    e.preventDefault();
    const data = {
      action,
      currentUser: currentUser,
      productsApi: inputValue.productsApi,
      qtyApi: inputValue.qtyApi,
      pricesApi: inputValue.pricesApi,
    };
    Axios.post(`${pathName}`, data)
      .then((res) => {
        console.log("Udało się dodać adresy API");
        if (res.data.setIsJoined) {
          setIsJoined(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const changeApi = (e, action, pathName) => {
    e.preventDefault();
    const data = {
      action,
      currentUser: currentUser,
      userId: userId,
      changeProductsApi: inputValue.changeProductsApi,
      changeQtyApi: inputValue.changeQtyApi,
      changePricesApi: inputValue.changePricesApi,
    };
    Axios.post(`${pathName}`, data)
      .then((res) => {
        console.log("Udało się zmienić adresy API");
        if (res.data.setIsJoined) {
          setIsJoined(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getProductsFile = (action, pathName) => {
    const data = {
      action,
      currentUser: currentUser,
    };
    Axios.post(`${pathName}`, data)
      .then((res) => {
        console.log("Sukces");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getProductsAvailibilityFile = (action, pathName) => {
    const data = {
      action,
      currentUser: currentUser,
    };
    Axios.post(`${pathName}`, data)
      .then((res) => {
        setStatusBoxText(res.data);
        console.log("Sukces");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPricesFile = (action, pathName) => {
    const data = {
      action,
      currentUser: currentUser,
    };
    Axios.post(`${pathName}`, data)
      .then((res) => {
        console.log("Sukces");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return {
    addApi,
    changeApi,
    getProductsFile,
    getProductsAvailibilityFile,
    getPricesFile,
  };
};

export default useAMPHook;
