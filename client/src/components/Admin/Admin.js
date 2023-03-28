import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";

import AppState from "../../hooks/AppState";

const Admin = () => {
  const navigate = useNavigate();
  const { isAuth, userIntegrators } = AppState();

  return (
    <div id="Admin">
      {userIntegrators.length === 0 ? (
        <>
          <h3>Nie masz jeszcze żadnego integratora</h3>
        </>
      ) : (
        <>
          <div className="userIntegrators-container">
            <h3>Twoje integratory</h3>
            {userIntegrators.map((value, index) => {
              return (
                <button
                  key={index}
                  onClick={() => this.props.history.push(`/${value}`)}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </>
      )}
      <div className="add-integrator-buttons">
        <h3>Dodaj integrator</h3>
        {userIntegrators.find((value) => value === "ShopGold-AMPPolska") ? (
          ""
        ) : (
          <button
            onClick={() => this.props.history.push("/ShopGold-AMPPolska")}
          >
            AMP Polska
          </button>
        )}
        {userIntegrators.find((value) => value === "ShopGold-FHSahs") ? (
          ""
        ) : (
          <button>FH Sahs</button>
        )}
      </div>
    </div>
  );
};

export default Admin;

/*
import React from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { AuthContext } from "../../App";

class Admin extends React.Component {
  state = {
    userIntegrators: [],
    allIntegrators: ["AMP Polska", "FH Sahs"],
    currentUser: localStorage.getItem("email"),
  };

  componentDidMount() {
    const userIntegrators = this.state.userIntegrators;
    const data = {
      currentUser: this.state.currentUser,
    };
    axios
      .post("/users-integrators", data)
      .then((res) => {
        console.log(res.data);
        this.setState({
          userIntegrators: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <AuthContext.Consumer>
        {({ isAuth }) => {
          return isAuth ? (
            <div id="Admin">
              {this.state.userIntegrators.length === 0 ? (
                <>
                  <h3>Nie masz jeszcze żadnego integratora</h3>
                </>
              ) : (
                <>
                  <div className="userIntegrators-container">
                    <h3>Twoje integratory</h3>
                    {this.state.userIntegrators.map((value, index) => {
                      return (
                        <button
                          key={index}
                          onClick={() => this.props.history.push(`/${value}`)}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
              <div className="add-integrator-buttons">
                <h3>Dodaj integrator</h3>
                {this.state.userIntegrators.find(
                  (value) => value === "ShopGold-AMPPolska"
                ) ? (
                  ""
                ) : (
                  <button
                    onClick={() =>
                      this.props.history.push("/ShopGold-AMPPolska")
                    }
                  >
                    AMP Polska
                  </button>
                )}
                {this.state.userIntegrators.find(
                  (value) => value === "ShopGold-FHSahs"
                ) ? (
                  ""
                ) : (
                  <button>FH Sahs</button>
                )}
              </div>
            </div>
          ) : (
            <Redirect to="/" />
          );
        }}
      </AuthContext.Consumer>
    );
  }
}

export default Admin;
*/
