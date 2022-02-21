import React, { useContext } from 'react';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';
import { LoginDetails } from '../App.js';

function Navbar(props)
{
    const loginSettings = useContext(LoginDetails);
    const loggedIn = loginSettings.loggedIn;
    const isAdmin = loginSettings.currentUser.admin;
    const navigate = useNavigate();

    var logout = () =>
    {
        loginSettings.loggedIn = false;
        loginSettings.cart = [];
        loginSettings.currentUser = {};
        loginSettings.setLogin(false);
        loginSettings.setCurrentUser("");
        loginSettings.setCart([]);
        navigate("/");
    }

    return(
        <>
        <div className='navigation color-primary'>
            <h2>Shopping Cart</h2>
            <div className='navigation-links'>
                
                    {
                        loggedIn?
                            isAdmin?
                                <ul>
                                    <Link to="/admin"><li>Home</li></Link>
                                    <Link to="/admin/users"><li>Users</li></Link>
                                    <Link to="/admin/products"><li>Products</li></Link>
                                    <Link to="/"><li onClick={() => logout()}>Logout</li></Link>
                                </ul>
                            :
                                <ul>
                                    <Link to="/"><li>Home</li></Link>
                                    <Link to="/cart"><li>Cart <span className='text-info'>(0)</span></li></Link>
                                    <Link to="/account"><li>Account</li></Link>
                                    <Link to="/"><li onClick={() => logout()}>Logout</li></Link>
                                </ul>
                        :
                        <ul>
                            <Link to="/"><li>Home</li></Link>
                            <Link to="/cart"><li>Cart</li></Link>
                            <Link to="/login"><li>Login</li></Link>
                            <Link to="/sign-up"><li>Sign Up</li></Link>
                        </ul>
                    }
                    
                
            </div>
        </div>
        </>
    )
}

export default Navbar;