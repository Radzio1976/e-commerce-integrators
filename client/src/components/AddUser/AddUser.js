import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../../App';
import './AddUser.css';

class AddUser extends React.Component {
  state = {
    company: {
      value: "",
      error: ""
    },
    nip: {
      value: "",
      error: ""
    },
    name: {
      value: "",
      error: ""
    },
    surname: {
      value: "",
      error: ""
    },
    email: {
      value: "",
      error: ""
    },
    password: {
      value: "",
      error: ""
    },
    password2: {
      value: "",
      error: ""
    },
    emaiExistError: "",
    registerSuccess: false
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: {
        ...this.state,
        value: e.target.value
      }
    })
  }

  addUser = (e) => {
    e.preventDefault();
    const { company, nip, name, surname, email, password, password2 } = this.state;
    let isValid = true;
    if (name.value.length < 5) {
      this.setState({
        name: {
          value: "",
          error: "Pole imię musi mieć conajmniej 5 znaków"
        }
      })
      isValid = false;
    }
    if (surname.value.length < 5) {
      this.setState({
        surname: {
          value: "",
          error: "Pole nazwisko musi mieć conajmniej 5 znaków"
        }
      })
      isValid = false;
    }
    if (email.value.includes("@") === false) {
      this.setState({
        email: {
          value: "",
          error: "Pole email musi zawierać znak @"
        }
      })
      isValid = false;
    }
    if (password.value.length < 5 || password.value !== password2.value) {
      this.setState({
        password2: {
          value: "",
          error: "Hasło nie jest takie samo"
        }
      })
      isValid = false;
    }
    if (isValid) {
      let user = {
        company: company.value,
        nip: nip.value,
        name: name.value,
        surname: surname.value,
        email: email.value,
        password: password.value,
      }

      axios.post("/addUser", user)
        .then(res => {
          console.log(res.data)
          this.setState({
            registerSuccess: res.data
          })
        })
        .catch(err => {
          console.log("Nie udało się dodać użytkownika do bazy danych", err)
        })
    }
  }
  render() {
    return (
      <div id="AddUser">
        {this.state.registerSuccess !== "Rejestracja przebiegła pomyślnie" ? <div className="add-user-form">
          <form onSubmit={this.addUser}>
            <label>Nazwa firmy:
          <input type="text" name="company" value={this.state.company.value} onChange={this.handleChange}></input></label>
            <label>NIP:
          <input type="text" name="nip" value={this.state.nip.value} onChange={this.handleChange}></input></label>
            <label>Imię:
            <input type="text" name="name" value={this.state.name.value} onChange={this.handleChange}></input></label>
            <p>{this.state.name.error}</p>
            <label>Nazwisko:
            <input type="text" name="surname" value={this.state.surname.value} onChange={this.handleChange}></input></label>
            <p>{this.state.surname.error}</p>
            <label>Email:
            <input type="text" name="email" value={this.state.email.value} onChange={this.handleChange}></input></label>
            <p>{this.state.email.error}</p>
            <p>{this.state.emaiExistError}</p>
            <label>Hasło:
            <input type="password" name="password" value={this.state.password.value} onChange={this.handleChange}></input></label>
            <label>Powtórz hasło:
            <input type="password" name="password2" value={this.state.password2.value} onChange={this.handleChange}></input></label>
            <p>{this.state.password2.error}</p>
            <button type="submit">Zarejestruj użytkownika</button>
          </form>
          <h5>{this.state.registerSuccess}</h5>
        </div> :
          <div className="add-user-form-success">
            <h1>{this.state.registerSuccess}</h1>
            <button onClick={() => this.props.history.push("/login")}>Zaloguj</button>
          </div>}
      </div>
    )
  }
}

export default withRouter(AddUser);