import logo from './logo.svg';
import './App.css';
import { useState, createContext } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, Switch } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Cart from './Components/Cart';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import Admin from './Components/Admin';
import AdminUsers from './Components/Admin/AdminUsers';
import AdminProducts from './Components/Admin/AdminProducts';
import Sales from './Components/Admin/Sales';
import MRInward from './Components/Admin/MRInward';
import NewMR from './Components/Admin/NewMR';

export const LoginDetails = createContext({});

function App() {
  const [loggedIn, setLogin] = useState(false); 
  const [currentUser, setCurrentUser] = useState("");
  const [cart, setCart] = useState([]);

  var updateCart = (login) => {
    if (login.loggedIn)
    {
      axios.put(`/users/${currentUser._id}/update/cart`, {cart: login.cart})
          .then((res) => {
            console.log(res);
            login.currentUser.cart = login.cart;
            login.setCurrentUser(login.currentUser);
            setCart(login.cart);
          })
          .catch((err) => {
            console.log(err);
          })
    }
    console.log(login, "updating...");
  }

  const userObject = {
    loggedIn: loggedIn,
    setLogin: setLogin,
    currentUser: currentUser,
    setCurrentUser: setCurrentUser,
    cart: cart,
    setCart: setCart,
    updateCart: updateCart
  }

  return (
    <Router>
      <LoginDetails.Provider value={userObject}>
      <div className="App">
        <Navbar cart={cart} />
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/cart" element={<Cart />}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/sign-up" element={<SignUp/>}/>
          <Route path="/admin" element={<Admin />}/>
          <Route path="/admin/users" element={<AdminUsers />}/>
          <Route path="/admin/products" element={<AdminProducts />}/>
          <Route path="/admin/sales" element={<Sales />}/>
          <Route path="/admin/mrinward" element={<MRInward />}/>
          <Route path="/admin/mrinward/new" element={<NewMR />}/>

          <Route path="*" element={<h3>404 - Page not found</h3>}/>
        </Routes>
      </div>
      </LoginDetails.Provider>
    </Router>
    
  );
}

export default App;
