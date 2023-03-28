import Axios from "axios";
import { useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";

import AppState from "../../hooks/AppState";

const Admin = () => {
  const navigate = useNavigate();
  const { isAuth, userIntegrators, setUserIntegrators, currentUser } =
    AppState();

  useEffect(() => {
    const data = {
      currentUser,
    };
    Axios.post("/users-integrators", data)
      .then((res) => {
        console.log(res.data);
        setUserIntegrators(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return isAuth ? (
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
                <button key={index} onClick={() => navigate(`/${value}`)}>
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
          <button onClick={() => navigate("/ShopGold-AMPPolska")}>
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
  ) : (
    <Navigate to="/" />
  );
};

export default Admin;
