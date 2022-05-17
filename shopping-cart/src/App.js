import './App.css';
import { useState, createContext } from 'react';
import axios from 'axios';
import { ROUTES, RenderRouter } from './routes';
import Navbar from './Components/Navbar';

export const LoginDetails = createContext({});

function App() {
  const [loggedIn, setLogin] = useState(false); 
  const [currentUser, setCurrentUser] = useState("");
  const [cart, setCart] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")); 

  var updateCart = (login) => {
    var user = JSON.parse(localStorage.getItem("user")); 
    console.log("updating cart...", user)
    if (user)
    {
      const config = {
        headers: { Authorization: `Bearer ${user.accessToken}` }
      };
      axios.put(`/users/${user._id}/update/cart`, {cart: login.currentUser.cart})
          .then((res) => {
            console.log(res);
            user.cart = login.cart;
            localStorage.setItem("user", JSON.stringify(user))
            login.currentUser.cart = login.cart;
            login.setCurrentUser(login.currentUser);
            setCart(login.cart);
          })
          .catch((err) => {
            console.log(err);
          })
    }
  }

  const userObject = {
    loggedIn: loggedIn,
    setLogin: setLogin,
    currentUser: currentUser,
    setCurrentUser: setCurrentUser,
    cart: cart,
    setCart: setCart,
    updateCart: updateCart,
  }

  return (
      <LoginDetails.Provider value={userObject}>
      <div className="App">
        <Navbar />
        <RenderRouter routes={ROUTES} />
        {/* <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/cart" element={<Cart />}/>
          <Route path="/checkout" element={<Checkout />}/> 
          <Route path="/checkout/confirmation" element={<Confirmation />} />
          <Route path="/payment" element={<Payment />}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/sign-up" element={<SignUp/>}/>
          <Route path="/account" element={<MyAccount />}/>
          <Route path="/admin/users" element={<AdminUsers />}/>
          <Route path="/admin/products" element={<AdminProducts />}/>
          <Route path="/admin/products/new" element={<AddProduct />}/>
          <Route path="/admin/sales" element={<Sales />}/>
          <Route path="/admin/mrinward" element={<MRInward />}/>
          <Route path="/admin/mrinward/new" element={<NewMR />}/>
          <Route path="/admin/mrinward/:mrid/edit" element={<NewMR />}/>
          <Route path="*" element={<h3>404 - Page not found</h3>}/>
        </Routes> */}
      </div>
      </LoginDetails.Provider>
    
  );
}

export default App;
