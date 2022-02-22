import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import axios from 'axios';
import { LoginDetails } from '../App.js';


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState()
  const navigate = useNavigate();
  const loginSettings = useContext(LoginDetails);

  var mergeCarts = (userCart, guestCart) =>
  {
    var newCart = [];
    for (let i = 0; i < userCart.length; i++) {
      for(let j = 0; j < guestCart.length; j++){
        if(userCart[i].product._id === guestCart[j].product._id){
          userCart[i].quantity = guestCart[j].quantity;
          guestCart.splice(j, 1);
        }
      }
    }
    newCart = [...userCart, ...guestCart];
    loginSettings.setCart(newCart);
    loginSettings.currentUser.cart = newCart;
    loginSettings.setCurrentUser(loginSettings.currentUser);
    loginSettings.updateCart(newCart);
  }

  var onLogin = (event) => 
  {
    event.preventDefault();
    if (!(username && password))
    {
      setAlert("Enter username and password");
      setTimeout(() => setAlert(""),2000)
    }
    else{
      axios.get(`/users/username/${username}`).then((res) => {
        if(res.data.length > 0)
        {
          if(res.data[0].password === password)
          {
            loginSettings.loggedIn = true;
            loginSettings.currentUser = res.data[0];
            loginSettings.setLogin(true);
            mergeCarts(res.data[0].cart, loginSettings.cart);
            res.data[0].admin? navigate("/admin/users"): navigate("/");
          }
          else
          {
            setAlert("Incorrect password");
            setTimeout(() => setAlert(""),2000)
          }
        }
        else
        {
          setAlert("User does not exist");
          setTimeout(() => setAlert(""),2000)
        }
    });
    
  }}
  return (
    <div className="container mt-5">
				<div className="col-md-6 col-lg-5 justify-content-center user-form">
					<div className="p-4 p-md-5">
		      	<h3 className="text-center mb-4">Login</h3>
            {alert && <div className="alert alert-danger" role="alert">
              {alert}
            </div>}
						<form onSubmit={onLogin}>
		      		<div className="form-group">
		      			<input type="text" className="form-control rounded-left mb-3 p-2" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}></input>
		      		</div>
	            <div className="form-group">
	              <input type="password" className="form-control rounded-left mb-3 p-2" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}></input>
	            </div>
	            <div className="form-group mt-3">
	            	<button type="submit" className="rounded submit p-2 px-4 w-100 color-primary">Login</button>
	            </div>
              <div className="form-group mt-3">
                <Link to="/sign-up">Create an account</Link>
              </div>
              
	          </form>
	        </div>
				</div>
		</div>
  )
}

export default Login;