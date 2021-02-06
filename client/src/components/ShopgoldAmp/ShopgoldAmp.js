import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../../App';
import './ShopGoldAmp.css';

class ShopgoldAmp extends React.Component {
  state = {
    productsApi: "",
    qtyApi: "",
    changeProductsApi: "",
    changeQtyApi: "",
    userId: localStorage.getItem("userId"),
    isJoined: false,
    currentUser: localStorage.getItem("email")
  }

  componentDidMount() {
    const data = {
      action: "getAmpApi",
      currentUser: this.state.currentUser
    }
    axios.post("/shopgold-amppolska", data)
      .then(res => {
        console.log(res.data)
        this.setState({
          changeProductsApi: res.data.productsApi,
          changeQtyApi: res.data.qtyApi,
          isJoined: res.data.isJoined,
        })
      })
      .catch(error => {
        console.log("Nie udało się połączyć z serwerem", error)
      })
  }


  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  addApi = (e) => {
    e.preventDefault();
    const data = {
      action: "addAmpApi",
      currentUser: this.state.currentUser,
      productsApi: this.state.productsApi,
      qtyApi: this.state.qtyApi
    }
    axios.post("/shopgold-amppolska", data)
      .then(res => {
        console.log(res.data)
      })
      .catch(error => {
        console.log(error)
      })
  }

  getAMPProductsFile = () => {
    console.log("Działa")
    const data = {
      action: "getAMPProductsFile",
      currentUser: this.state.currentUser
    }
    axios.post("/shopgold-amppolska", data)
      .then(res => {
        console.log(res.data)
      })
      .catch(error => {
        console.log(error)
      })
  }

  getAMPUpdateFile = () => {
    console.log("Działa")
    const data = {
      action: "getAMPUpdateFile",
      currentUser: this.state.currentUser
    }
    axios.post("/shopgold-amppolska", data)
      .then(res => {
        console.log(res.data)
      })
      .catch(error => {
        console.log(error)
      })
  }

  getAMPPricesFile = () => {
    const data = {
      action: "getAMPPricesFile",
      currentUser: this.state.currentUser
    }
    axios.post("/shopgold-amppolska", data)
      .then(res => {
        console.log(res.data)
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    return (
      <AuthContext.Consumer>
        {
          ({ isAuth }) => {
            return (
              isAuth ?
                <div id="ShopgoldAmp">
                  {
                    !this.state.isJoined ? <div id="AddAmpApi">
                      <form onSubmit={this.addApi}>
                        <label>Adres API pliku z produktami
        <input type="text" name="productsApi" value={this.state.productsApi} onChange={this.handleChange}></input></label>
                        <label>Adres API pliku ze stanami magazynowymi
        <input type="text" name="qtyApi" value={this.state.qtyApi} onChange={this.handleChange}></input></label>
                        <button>Zapisz</button>
                      </form>
                    </div> :
                      <div id="ChangeAmpApi">
                        <form onSubmit={this.changeApi}>
                          <label>Podstawowy plik z produktami
        <input type="text" name="changeProductsApi" value={this.state.changeProductsApi} onChange={this.handleChange}></input></label>
                          <label>Stany produktów
        <input type="text" name="changeQtyApi" value={this.state.changeQtyApi} onChange={this.handleChange}></input></label>
                          <button>Zmień</button>
                        </form>
                      </div>
                  }
                  <div id="getAmpDataButtons">
                    <button onClick={this.getAMPProductsFile}>Pobierz plik z bazą produktów</button>
                    <button onClick={this.getAMPUpdateFile}>Pobierz plik aktualizacyjny</button>
                    <button onClick={this.getAMPPricesFile}>Pobierz plik z cenami</button>
                  </div>

                </div> :
                <Redirect to="/" />
            )
          }
        }
      </AuthContext.Consumer>
    )
  }
}

export default ShopgoldAmp;