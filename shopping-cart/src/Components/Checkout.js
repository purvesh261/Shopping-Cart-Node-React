import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginDetails } from '../App.js';
import axios from 'axios';

function Checkout() {
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [alert, setAlert] = useState("");
    const navigate = useNavigate();
    const contextData = useContext(LoginDetails);

    useEffect(() => {
        if(!contextData.loggedIn)
        {
            navigate("/login");
        }
    }, []);

    var onPhoneChange = (event) => 
    {
        const re = /^[0-9\b]{0,10}$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            setPhone(event.target.value)
         }
    }

    var placeOrder = (order) =>
    {
        axios.post('/orders/create', order)
            .then(res => {
            contextData.currentUser.cart.forEach(product => {
                axios.put(`http://localhost:5000/products/${product.product._id}/update/stock`, {
                    orderQuantity: product.quantity
                })
                .then(res => {
                    console.log(res);
                    
                })
                .catch(err => {
                    console.log(err);
                })
            });
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


    var submitOrder = (event) => 
    {
        event.preventDefault();
            
        var order = {
            user: contextData.currentUser._id,
            products: contextData.currentUser.cart,
            total: contextData.total,
            address: address,
            phone: phone,
        }

        var unavailableProducts = [];
        order.products.forEach(product => {
            axios.get(`http://localhost:5000/products/${product.product._id}`)
            .then(res => {
                if(Number(res.data.stock) < Number(product.quantity))
                {
                    unavailableProducts.push(res.data.name);
                }
                if(unavailableProducts.length > 0)
                {
                    var alertMessage = "Following products are unavailable:\n";
                    unavailableProducts.forEach(product => {
                        alertMessage += product + "\n";
                    });

                    setAlert(alertMessage);

                }
                else
                {
                    placeOrder(order);
                }
            })
        });
    }

    return (
        <>
            <div className="border color-primary cart-top">
            <h3>Checkout</h3>
            </div>
            
            <div className="border checkout-form">
            {alert && <div className="alert alert-danger mb-3 mx-2">
                <h4 class="alert-heading">Products unavailable</h4>

                <p>{alert}</p>
                <Link to="/cart"><button className="btn btn-primary">Back to cart</button></Link>
            </div>}
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