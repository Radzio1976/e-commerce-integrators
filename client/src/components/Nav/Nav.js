import React from 'react';
import { withRouter } from 'react-router-dom';
import { AuthContext } from '../../App';

function Nav(props) {
  return (
    <AuthContext.Consumer>
      {
        ({ isAuth, currentUser, logout }) => {
          return (
            <div id="Nav">
              <div className="logo">
                <h3>Logo</h3>
              </div>
              <div className="logged-in">
                {
                  isAuth ?
                    <h5>Zalogowany: {currentUser}</h5> : ""
                }
              </div>
              <div className="nav-bar">
                {
                  isAuth ?
                    <>
                      <button onClick={() => logout()}>Wyloguj się</button>
                      <button onClick={() => props.history.push("/admin")}>Admin</button>
                    </> :
                    <>
                      <button onClick={() => props.history.push("/login")}>Zaloguj</button>
                      <button onClick={() => props.history.push("/add-user")}>Zarejestruj się</button>
                    </>
                }
              </div>
            </div>
          )
        }
      }

    </AuthContext.Consumer>
  )
}

export default withRouter(Nav);