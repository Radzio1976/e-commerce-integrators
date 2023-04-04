import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import AddUser from "./components/AddUser";
import Admin from "./components/Admin";

import ShopGoldAMPPolska from "./components/AdminPanel/ShopGoldAMPPolska";
import ShopGoldKellys from "./components/AdminPanel/ShopGoldKellys";
import ShopGoldFHSahs from "./components/AdminPanel/ShopGoldFHSahs";

import AppState from "./hooks/AppState";

const App = () => {
  const { setIsAuth, setCurrentUser } = AppState();

  useEffect(() => {
    if (localStorage.getItem("email") === null) {
      setIsAuth(false);
      setCurrentUser("");
    } else {
      setIsAuth(true);
      setCurrentUser(localStorage.getItem("email"));
    }
  }, []);

  return (
    <div id="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/admin" element={<Admin />} />
          <Route
            path="/admin/shopgold-amppolska"
            element={<ShopGoldAMPPolska />}
          />
          <Route path="/admin/shopgold-fhsahs" element={<ShopGoldFHSahs />} />
          <Route path="/admin/shopgold-kellys" element={<ShopGoldKellys />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
