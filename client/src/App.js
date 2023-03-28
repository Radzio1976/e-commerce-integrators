import React from "react";
import { createContext } from "react";
import { BrowserRouter, Switch, Route, Routes } from "react-router-dom";
import "./App.css";
//import Home from "./components/Home";
import AddUser from "./components/AddUser";
//import Login from "./components/Login";
//import Nav from "./components/Nav";
import Admin from "./components/Admin";
//import ShopGoldAmp from "./components/ShopgoldAmp";

const AuthContext = createContext();

class App extends React.Component {
  state = {
    isAuth: false,
    currentUser: "",
  };

  componentDidMount() {
    if (localStorage.getItem("email") === null) {
      this.setState({
        isAuth: false,
        currentUser: "",
      });
    } else {
      this.setState({
        isAuth: true,
        currentUser: localStorage.getItem("email"),
      });
    }
  }

  login = (email) => {
    localStorage.setItem("email", email);
    this.setState({
      isAuth: true,
      currentUser: email,
    });
  };

  logout = () => {
    localStorage.removeItem("email");
    this.setState({
      isAuth: false,
      currentUser: "",
    });
  };

  render() {
    return (
      <div id="App">
        <AuthContext.Provider
          value={{
            login: this.login,
            logout: this.logout,
            isAuth: this.state.isAuth,
            currentUser: this.state.currentUser,
          }}
        >
          <BrowserRouter>
            <Routes>
              <Route path="/add-user" element={<AddUser />} />

              <Route path="/admin" element={<Admin />} />
            </Routes>
          </BrowserRouter>
        </AuthContext.Provider>
      </div>
    );
  }
}

export { AuthContext };
export default App;

/*
import React from "react";
import { createContext } from "react";
import { BrowserRouter, Switch, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import AddUser from "./components/AddUser";
import Login from "./components/Login";
import Nav from "./components/Nav";
import Admin from "./components/Admin";
import ShopGoldAmp from "./components/ShopgoldAmp";

const AuthContext = createContext();

class App extends React.Component {
  state = {
    isAuth: false,
    currentUser: "",
  };

  componentDidMount() {
    if (localStorage.getItem("email") === null) {
      this.setState({
        isAuth: false,
        currentUser: "",
      });
    } else {
      this.setState({
        isAuth: true,
        currentUser: localStorage.getItem("email"),
      });
    }
  }

  login = (email) => {
    localStorage.setItem("email", email);
    this.setState({
      isAuth: true,
      currentUser: email,
    });
  };

  logout = () => {
    localStorage.removeItem("email");
    this.setState({
      isAuth: false,
      currentUser: "",
    });
  };

  render() {
    return (
      <div id="App">
        <AuthContext.Provider
          value={{
            login: this.login,
            logout: this.logout,
            isAuth: this.state.isAuth,
            currentUser: this.state.currentUser,
          }}
        >
          <BrowserRouter>
            <Nav />
            <Routes>
              <Route path="/" exact element={<Home />} />
              <Route path="/add-user" element={<AddUser />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/ShopGold-AMPPolska" element={<ShopGoldAmp />} />
            </Routes>
          </BrowserRouter>
        </AuthContext.Provider>
      </div>
    );
  }
}

export { AuthContext };
export default App;

*/
