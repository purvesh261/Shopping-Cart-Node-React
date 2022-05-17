import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import axios from 'axios';
import { LoginDetails } from '../App.js';


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState();
  const navigate = useNavigate();
  const contextData = useContext(LoginDetails);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
      if(user)
      {
        if(user.admin)
        {
          navigate("/admin/users");
        }
        else
        {
          navigate("/");
        } 
      }
  },[]);
  
  useEffect(() => {
    if (contextData.loggedIn === true)
    {
      console.log(contextData.currentUser, "context");
      mergeCarts(contextData.currentUser.cart, contextData.cart);
      contextData.currentUser.admin? navigate("/admin/users"): navigate("/");
    }
  }, [contextData.currentUser]);

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
    contextData.setCart(newCart);
    contextData.currentUser.cart = newCart;
    contextData.setCurrentUser(contextData.currentUser);
    console.log(contextData, "UPDATED CARTS")
    contextData.updateCart(contextData);
  }

  var onLogin = (event) => 
  {
    event.preventDefault();
    if (!(username && password))
    {
      setAlert("Enter username and password");
      setTimeout(() => setAlert(""),2000)
    }
    else
    {
      axios.post('/users/authenticate', { username, password }).then((res) => {
        if (!res.data.error)
        {
          contextData.setLogin(true);
          contextData.setCurrentUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
          localStorage.setItem('accessToken', res.data.accessToken);
        }
        else
        {
          setAlert(res.data.error);
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
		      			<input type="text"
                className="form-control rounded-left mb-3 p-2"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required>
                </input>
		      		</div>
	            <div className="form-group">
	              <input type="password"
                className="form-control rounded-left mb-3 p-2"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)} required>
                </input>
	            </div>
	            <div className="form-group mt-3">
	            	<button
                  type="submit"
                  className="rounded submit p-2 px-4 w-100 color-primary">
                    Login
                </button>
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