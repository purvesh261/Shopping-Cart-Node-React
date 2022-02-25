import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginDetails } from '../App.js';
import axios from 'axios';

function Checkout() {
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const navigate = useNavigate();
    const contextData = useContext(LoginDetails);

    useEffect(() => {
        console.log(contextData, "contextData");
    }, []);

    var onPhoneChange = (event) => 
    {
        const re = /^[0-9\b]{0,10}$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            setPhone(event.target.value)
         }
    }

    var submitOrder = (event) => 
    {
        event.preventDefault();
            
        contextData.checkout = { address, phone }
        var order = {
            user: contextData.currentUser._id,
            products: contextData.currentUser.cart,
            total: contextData.total,
            address: address,
            phone: phone,
        }
        console.log(order, "this is order")
        axios.post('/orders/create', order)
        .then(res => {
            console.log(res);
            contextData.currentUser.cart = [];
            contextData.setCurrentUser(contextData.currentUser);
            contextData.updateCart([]);
            contextData.setCart([]);
            navigate('/checkout/confirmation');
        })
        .catch(err => {
            console.log(err);
        })
        
    }

    return (
        <>
            <div className="border color-primary cart-top">
            <h3>Checkout</h3>
            </div>
            <div className="border checkout-form">
                <form onSubmit={submitOrder} >
                    <div className='input'>
                        <label htmlFor='address'>Address</label>
                        <textarea type="address" rows={5} className='form-control w-25' name="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder='Enter your address' required/>
                    </div>
                    <div className='input'>
                        <label htmlFor='address'>Phone</label>
                        <input type="phone" className='form-control w-25' name="phone" value={phone} onChange={onPhoneChange} placeholder="Enter your phone number" required/>
                    </div>
                    <div className='input'>
                        <input type="submit" className='btn btn-warning' value="Place Order" />
                    </div>
                </form>
            </div>
        </>
    )
}

export default Checkout;