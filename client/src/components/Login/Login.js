import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../../App';

class Login extends React.Component {
  state = {
    email: "",
    password: "",
    loginError: ""
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = (e, login) => {
    e.preventDefault();
    const { email, password } = this.state;
    const user = {
      email,
      password
    }
    axios.post("/login", user)
      .then(res => {
        console.log(res.data)
        if (res.data === "Nie udało się pobrać informacji o takim użytkowniku") {
          this.setState({
            loginError: res.data
          })
        } else if (res.data === "Niepoprawny adres email lub hasło") {
          this.setState({
            loginError: res.data
          })
        } else {
          login(email)
        }
      })
  }

  render() {
    return (
      <AuthContext.Consumer>
        {
          ({ isAuth, login }) => {
            return (
              <div id="Login">
                <h3>Zaloguj się</h3>
                <form onSubmit={(e) => this.handleSubmit(e, login)}>
                  <label>Email:
          <input type="text" name="email" value={this.state.email} onChange={this.handleChange}></input></label>
                  <label>Hasło
          <input type="password" name="password" value={this.state.password} onChange={this.handleChange}></input></label>
                  <button>Zaloguj</button>
                  <p>{this.state.loginError}</p>
                </form>
              </div>
            )
          }
        }
      </AuthContext.Consumer>
    )

  }
}

export default Login;