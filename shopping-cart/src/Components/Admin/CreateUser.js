import React, { useState, useEffect } from 'react';
import '../../App.css'
import axios from 'axios';

// component to create a new user
function CreateUser(props) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [usernameExists, setUsernameExists] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [status, setStatus] = useState(false);
    const [passwordValidation, setPasswordValidation] = useState();
    const [alert, setAlert] = useState("")
    const [success, setSuccess] = useState("")
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
      if (!(username && email && password && confirmPassword))
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
          admin: admin,
          status: status,
          cart: []
        };
  
        axios.post("/users/", newUser )
        .then(res => {
            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setAdmin(false);
            setStatus(false);
            setSuccess("User created successfully");
            setTimeout(() => setSuccess(""), 2000);
            props.setUserAdded(!props.userAdded);
        })
      }
      
    }
    return (
            <div>
                <div className="p-md-5">
                    <h3 className="mb-4">Create User</h3>
                    {
                    alert && 
                        <div className="alert alert-danger" role="alert">
                            {alert}
                        </div>
                    }
                    {
                    success && 
                        <div className="alert alert-success" role="alert">
                            {success}
                        </div>
                    }
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
                        <input type="text"
                                className="form-control rounded-left mb-3 p-2"
                                placeholder="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}>
                        </input>
                    </div>

                    <div className="form-group">
                        <input type="password"
                            className="form-control rounded-left mb-3 p-2"
                            placeholder="Password" value={password}
                            onFocus={() => setPasswordValidation(true)}
                            onBlur={() => setPasswordValidation(false)}
                            onChange={(e) => setPassword(e.target.value)}>
                        </input>
                        { passwordValidation && 
                            <div className='text-secondary mb-1 small'>
                                Password must be atleast 6 characters and must contain 
                                1 lowercase character, 1 uppercase character, 1 digit 
                                and 1 special character.
                            </div>}
                    </div>

                    <div className="form-group">
                        <input type="password"
                                className="form-control rounded-left mb-3 p-2"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}>
                        </input>
                    </div>

                    <div className="form-group">
                        <label>Admin: </label>
                        <input type="checkbox"
                                className="form-check-input mb-3 p-2"
                                name="admin"
                                value={admin}
                                checked={admin}
                                onChange={(e) => e.target.checked? setAdmin(true) : setAdmin(false)}>
                        </input>
                    </div>

                    <div className="form-group">
                        <label>Status: </label>
                        <input type="checkbox"
                                className="form-check-input mb-3 p-2"
                                name="status"
                                value={status}
                                checked={status}
                                onChange={(e) => e.target.checked? setStatus(true) : setStatus(false)}>
                        </input>
                    </div>
        
                    <div className="form-group mt-3">
                        <button type="submit" className="rounded submit p-2 px-4 w-100 color-primary">Submit</button>
                    </div>
                    </form>
                </div>
            </div>
    )
}

export default CreateUser;