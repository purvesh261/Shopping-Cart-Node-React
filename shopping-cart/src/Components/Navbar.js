import React, { useContext, useEffect, useState } from 'react';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';
import { LoginDetails } from '../App.js';

function Navbar()
{
    const contextData = useContext(LoginDetails);
    const loggedIn = contextData.loggedIn;
    const isAdmin = contextData.currentUser.admin;
    const navigate = useNavigate();


    var logout = () =>
    {
        contextData.loggedIn = false;
        contextData.currentUser = {};
        contextData.setLogin(false);
        contextData.setCurrentUser("");
        contextData.setCart([]);
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
                                    <Link to="/admin/users"><li>Users</li></Link>
                                    <Link to="/admin/products"><li>Products</li></Link>
                                    <Link to="/admin/sales"><li>Sales</li></Link>
                                    <Link to="/admin/mrinward"><li>MR Inward</li></Link>
                                    <Link to="/"><li onClick={() => logout()}>Logout</li></Link>
                                </ul>
                            :
                                <ul>
                                    <Link to="/"><li>Home</li></Link>
                                    <Link to="/cart"><li>Cart</li></Link>
                                    {/* <Link to="/account"><li>{contextData.currentUser.username}</li></Link> */}
                                    <Link to="/account"><li>Orders</li></Link>
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