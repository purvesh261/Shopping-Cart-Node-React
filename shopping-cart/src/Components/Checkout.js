import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { LoginDetails } from '../App.js';
import axios from 'axios';

function Checkout() {
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [alert, setAlert] = useState("");
    const [paymentMode, setPaymentMode] = useState("online");
    const navigate = useNavigate();
    const contextData = useContext(LoginDetails);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        var user = JSON.parse(localStorage.getItem("user"));
        if(user.cart.length < 1)
        {
            console.log(user, "herer")
            navigate('/');
        }
    }, []);

    var onPhoneChange = (event) => 
    {
        const re = /^[0-9\b]{0,10}$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            setPhone(event.target.value)
         }
    }

    var getTotal = (cart) =>
    {
        var newAmount = 0;
        for (let i = 0; i < cart.length; i++) {
        newAmount += cart[i].product.price * cart[i].quantity;
        }
        var newTax = Number(newAmount * 0.1).toFixed(2);
        var newShipping = 150;
        var newTotal = Number(newAmount) + Number(newTax) + Number(newShipping);
        newTotal = Number(newTotal).toFixed(2);
        return {amount:newAmount, tax:newTax, shipping:newShipping, total:newTotal}
    }

    var placeOrder = (order) =>
    {
        contextData.order = order;
        if(paymentMode === "online")
        {
            return navigate('/payment');
        }

        axios.post('/orders/create', order)
            .then(res => {
                order.products.forEach(product => {
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

                navigate('/checkout/confirmation');
            })
        .catch(err => {
            console.log(err);
        })
    }


    var submitOrder = async (event) => 
    {
        event.preventDefault();
        var cartRes = await axios.get(`http://localhost:5000/users/${user._id}/cart`)
        var cart = cartRes.data;
        var total = getTotal(cart);
        var order = {
            user: user._id,
            products: cart,
            total: total,
            address: address,
            phone: phone,
            paymentMode: paymentMode,
        }

        var unavailableProducts = [];
        cart.forEach(product => {
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
                        Payment method:<br/>
                        <input className="form-check-input m-1" type="radio" name="flexRadioDefault" id="online" checked={paymentMode === "online"} onClick={() => setPaymentMode("online")}/>
                        <label className="form-check-label" for="online">
                            Online
                        </label><br/>
                        <input className="form-check-input m-1" type="radio" name="flexRadioDefault" id="cash" checked={paymentMode === "cash"} onClick={() => setPaymentMode("cash")}/>
                        <label className="form-check-label" for="cash">
                            Cash on Delivery
                        </label>
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