import React from 'react';
import logo from './logo.svg';
import { createContext } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import AddUser from './components/AddUser';

class App extends React.Component {

  render() {
    return (
      <div id="App">
        <BrowserRouter>
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/add-user' component={AddUser} />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}

export default App;
