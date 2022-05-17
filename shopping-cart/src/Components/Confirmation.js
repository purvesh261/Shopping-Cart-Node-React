import React,  { useContext, useEffect, useState } from 'react';
import { LoginDetails } from "../App";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Confirmation() {
    const contextData = useContext(LoginDetails);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if(!contextData.order)
        {
            navigate("/");
        }
        
        var user = JSON.parse(localStorage.getItem("user"));
        contextData.order = null;
        contextData.cart = [];
        if(!contextData.currentUser){
            contextData.currentUser = user;
        }
        contextData.currentUser.cart = [];
        contextData.setCurrentUser(contextData.currentUser);
        contextData.setCart([]);
        axios.put(`/users/${user._id}/update/cart`, {cart: []})
            .then(res => {
                console.log("Cart updated");
            })
            .catch(err => {
                console.log(err);
            })



    }, [])
    return (
    <div className='card w-50'>
        <div className='card-body'>
            <h3 className='text-success'>Thank you for your order!</h3>
            <p className='text-secondary'>Your order has been placed successfully!</p>
            <Link to="/"><button className='login-btn color-primary rounded p-2 px-4'>Back to Home</button></Link>
        </div>
    </div>
  )
}

export default Confirmation;