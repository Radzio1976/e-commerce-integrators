import Axios from "axios";
import AppState from "./AppState";

const useAMPHook = () => {
  const { currentUser, userId, inputValue, setIsJoined } = AppState();
  const addApi = (e) => {
    e.preventDefault();
    const data = {
      action: "addAmpApi",
      currentUser: currentUser,
      productsApi: inputValue.productsApi,
      qtyApi: inputValue.qtyApi,
      pricesApi: inputValue.pricesApi,
    };
    Axios.post("/shopgold-amppolska", data)
      .then((res) => {
        console.log(res.data);
        setIsJoined(res.data.setIsJoined);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const changeApi = (e) => {
    e.preventDefault();
    const data = {
      action: "changeAmpApi",
      currentUser: currentUser,
      userId: userId,
      changeProductsApi: inputValue.changeProductsApi,
      changeQtyApi: inputValue.changeQtyApi,
      changePricesApi: inputValue.changePricesApi,
    };
    Axios.post("/shopgold-amppolska", data)
      .then((res) => {
        console.log(res.data);
        setIsJoined(res.data.setIsJoined);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAMPProductsFile = () => {
    const data = {
      action: "getAMPProductsFile",
      currentUser: currentUser,
    };
    Axios.post("/shopgold-amppolska", data)
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAMPUpdateFile = () => {
    console.log("Działa");
    const data = {
      action: "getAMPUpdateFile",
      currentUser: currentUser,
    };
    Axios.post("/shopgold-amppolska", data)
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAMPPricesFile = () => {
    const data = {
      action: "getAMPPricesFile",
      currentUser: currentUser,
    };
    Axios.post("/shopgold-amppolska", data)
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return {
    addApi,
    changeApi,
    getAMPProductsFile,
    getAMPUpdateFile,
    getAMPPricesFile,
  };
};

export default useAMPHook;
