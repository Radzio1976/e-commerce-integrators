import React from 'react';
import { createContext } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import AddUser from './components/AddUser';
import Login from './components/Login';

const AuthContext = createContext();

class App extends React.Component {
  state = {
    isAuth: false
  }

  componentDidMount() {
    console.log(localStorage.getItem('email'));
  }

  login = (email) => {
    localStorage.setItem('email', email);
    this.setState({
      isAuth: true
    })
  }

  logout = () => {
    localStorage.removeItem('email');
    this.setState({
      isAuth: false
    })
  }

  render() {
    return (
      <div id="App">
        <AuthContext.Provider value={{ login: this.login, logout: this.logout }}>
          <BrowserRouter>
            <Switch>
              <Route path='/' exact component={Home} />
              <Route path='/add-user' component={AddUser} />
              <Route path='/login' component={Login} />
            </Switch>
          </BrowserRouter>
        </AuthContext.Provider>
      </div>
    )
  }
}

export { AuthContext };
export default App;
