import Axios from "axios";
import AppState from "./AppState";

const useAMPHook = () => {
  const { currentUser, inputValue } = AppState();
  const addApi = (e) => {
    e.preventDefault();
    const data = {
      action: "addAmpApi",
      currentUser: currentUser,
      productsApi: inputValue.productsApi,
      qtyApi: inputValue.qtyApi,
    };
    Axios.post("/shopgold-amppolska", data)
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAMPProductsFile = () => {
    console.log("Działa");
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
  return { addApi, getAMPProductsFile, getAMPUpdateFile, getAMPPricesFile };
};

export default useAMPHook;
