import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LoginDetails } from '../App';

function Payment() {
    const [values, setValues] = useState({
                                amount: 0,
                                orderId: '',
                                error:'',
                                success: false,
                            });
    const navigate = useNavigate();
    const [button, setButton] = useState(false)
    const contextData = useContext(LoginDetails);
    const user = JSON.parse(localStorage.getItem("user"));
    
    useEffect(() => {
        if(!contextData.order)
        {
            navigate('/');
        }
    }, []);

    const getOrder = async () => {
        try{
            var res = await axios.post("http://localhost:5000/orders/payment", { amount: Number(contextData.order.total.total) * 100});
            if(res.data.error)
            {
                setValues({ ...values, error:res.data.error, success:false});
            }
            else {
                setValues({ ...values, error:"", success:true, orderId:res.data.id, amount: res.data.amount})
                console.log(res.data);
            }
        }
        catch(err){
            console.log(err);
        }
    }
    
    useEffect(() => {
        if(!contextData.order) {
            navigate('/cart');
        }
        getOrder();
    }, []);

    useEffect(() => {
        if(!button)
        {
            if (values.amount > 0 && values.orderId != "") {
              showRazorPay();
              setButton(true);
            }
        }
      }, [values.amount]);

    const showRazorPay = () => {

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.setAttribute("redirect", "true")
        script.setAttribute("data-key", "rzp_test_H9dPEFJcZVfPVu");
        script.setAttribute("data-amount", values.amount);
        script.setAttribute("data-name", "Shopping Cart");
        script.setAttribute("data-prefill.contact", contextData.order.phone);
        script.setAttribute("data-prefill.email", user.email);
        script.setAttribute("data-order_id", values.orderId);
        script.setAttribute("data-prefill.name", user.username);
        const form = document.getElementById("payment-form");
        script.setAttribute("data-buttontext", "Pay with Razorpay");
        form.appendChild(script);
        // const input = document.createElement("input");
        // input.type = "hidden";
        // input.custom = "Hidden Element";
        // input.name = "hidden";
        // form.appendChild(input);
      };

    const onFormSubmit = (event) => {
        event.preventDefault();
        console.log(event.target);
    }

    return (
        <>
        { values.amount && 
        <div className='payment-form'>
        <form action="http://localhost:3000/checkout/create-order/" method="GET" id="payment-form">  
            <h6>Complete your payment with Razorpay</h6>
            Total: {contextData.order.total.total}<br/>
            Address: {contextData.order.address}<br/>
            Phone: {contextData.order.phone}<br/>
            <div id="button-div"></div>
        </form>
        </div>
        }
        </>
    )
}

export default Payment;