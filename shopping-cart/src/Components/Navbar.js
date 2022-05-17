import React, { useContext, useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { LoginDetails } from '../App.js';

function Navbar()
{
    const contextData = useContext(LoginDetails);
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    var logoutRequest = async (userId, accessToken) => {
        console.log("contextdata", contextData)
        const config = {
            headers: { Authorization: `Bearer ${accessToken}` }
        };
        console.log("config", config)
        try
        {
            await axios.post('/users/logout', {_id: userId}, config);
            localStorage.clear();
            navigate("/");
        }
        catch(err)
        {
            console.log("Error: " + err);
        }
        
    }
    var logout = () =>
    {
        contextData.loggedIn = false;
        contextData.currentUser = {};
        contextData.setLogin(false);
        contextData.setCurrentUser("");
        contextData.setCart([]);
        localStorage.clear();
        navigate("/")
        // logoutRequest(user._id, user.accessToken)
    }

    return(
        <>
        <div className='navigation color-primary'>
            <h2>Shopping Cart</h2>
            <div className='navigation-links'>
                
                    {
                        user?
                            user.admin?
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