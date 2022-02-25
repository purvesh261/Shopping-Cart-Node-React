import React,  { useContext, useEffect, useState } from 'react';
import { LoginDetails } from "../App";
import { Link, useNavigate } from 'react-router-dom';

function Confirmation() {
    const contextData = useContext(LoginDetails);
    const navigate = useNavigate();

    useEffect(() => {
        if(!contextData.loggedIn)
        {
            navigate("/login");
        }
    }, []);
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