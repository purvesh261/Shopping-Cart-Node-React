import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { LoginDetails } from '../App.js';
import axios from 'axios';


function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameExists, setUsernameExists] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState();
  const [alert, setAlert] = useState()
  const loginSettings = useContext(LoginDetails);
  const navigate = useNavigate();
  const validUsername = new RegExp('^[a-zA-Z0-9]{5,}$');
  const validPassword = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$');
  const validEmail = new RegExp('^[a-z0-9]+[\\._]?[a-z0-9]+[@]\\w+[.]\\w{2,3}$');

  var userExists = () => {
    if(!username)
    {
      return;
    }
    axios.get(`/users/username/${username}`)
      .then(res => {
        console.log(res.data)
        if (res.data.length > 0) {
          setAlert("Username already exists");
          setTimeout(() => setAlert(""), 2000)
          setUsernameExists(true);
        }
        else {
          setUsernameExists(false);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  var onSubmit = (event) => 
  {
    event.preventDefault();
    console.log(event.target);
    if (!(username && email && password && confirmPassword && checked))
    {
      setAlert("Enter all the fields");
      setTimeout(() => setAlert(""),2000)
    }
    else if(usernameExists)
    {
      setAlert("Username already exists");
      setTimeout(() => setAlert(""),2000)
    }
    else if(!validUsername.test(username))
    {
      setAlert("Username must be at least 5 characters long");
      setTimeout(() => setAlert(""),2000)
    }
    else if(!validEmail.test(email))
    {
      setAlert("Enter a valid email");
      setTimeout(() => setAlert(""),2000)
    }
    else if(!validPassword.test(password))
    {
      setAlert("Not a valid password");
    }
    else if (password !== confirmPassword)
    {
      setAlert("Passwords do not match");
      setTimeout(() => setAlert(""),2000)
    }
    else{
      let newUser = {
        username: username,
        email: email,
        password: password,
        admin: false,
        status: true,
        cart: []
      };

      axios.post("/users/", newUser )
      .then(res => {
        loginSettings.currentUser = newUser;
        loginSettings.loggedIn = true;
        loginSettings.cart = []
        loginSettings.setLogin(true);
        loginSettings.setCurrentUser(newUser);
        loginSettings.setCart([]);
        navigate("/");
      })
    }
    
  }
  return (
    <div className="container mt-5">
				<div className="col-md-6 col-lg-5 justify-content-center user-form">
					<div className="p-4 p-md-5">
		      	<h3 className="text-center mb-4">Sign Up</h3>
            {alert && <div className="alert alert-danger" role="alert">
              {alert}
            </div>}
						<form onSubmit={onSubmit}>
		      		<div className="form-group">
		      			<input type="text"
                      className="form-control rounded-left mb-3 p-2"
                      placeholder="Username"
                      value={username}
                      onBlur={userExists}
                      onChange={e => setUsername(e.target.value)}>
                </input>
		      		</div>

              <div className="form-group">
		      			<input type="text" className="form-control rounded-left mb-3 p-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}></input>
		      		</div>

	            <div className="form-group">
	              <input type="password"
                      className="form-control rounded-left mb-3 p-2"
                      placeholder="Password" value={password}
                      onFocus={() => setPasswordValidation(true)}
                      onBlur={() => setPasswordValidation(false)}
                      onChange={(e) => setPassword(e.target.value)}>
                </input>
                { passwordValidation && <div className='text-secondary mb-1 small'>Password must be atleast 6 characters and must contain 1 lowercase character, 1 uppercase character, 1 digit and 1 special character.</div>}
	            </div>

              <div className="form-group">
	              <input type="password" className="form-control rounded-left mb-3 p-2" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}></input>
	            </div>

              <div className="form-group">
                <input type="checkbox" className="form-check-input" value={checked} onChange={setChecked}></input><span className="small"> I agree to the Terms and Conditions.</span>
              </div>
          
	            <div className="form-group mt-3">
	            	<button type="submit" className="rounded submit p-2 px-4 w-100 color-primary">Submit</button>
	            </div>
              
	          </form>
	        </div>
				</div>
		</div>
  )
}

export default Signup;