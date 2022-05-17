import React, { useState, useContext } from 'react';
import { LoginDetails } from '../App';
import axios from 'axios';
import '../App.css';
import { useNavigate } from 'react-router-dom';

function loadScript(src) {
	return new Promise((resolve) => {
		const script = document.createElement('script')
		script.src = src
		script.onload = () => {
			resolve(true)
		}
		script.onerror = () => {
			resolve(false)
		}
		document.body.appendChild(script)
	})
}

const __DEV__ = document.domain === 'localhost'

function Razorpay() {
    const contextData = useContext(LoginDetails);
    const user = JSON.parse(localStorage.getItem("user"));
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const submitOrder = async () => {
        try {
            console.log(contextData)
            var res = await axios.post("http://localhost:5000/orders/create", contextData.order);
            contextData.order.products.forEach(product => {
                axios.put(`http://localhost:5000/products/${product.product._id}/update/stock`, {
                    orderQuantity: product.quantity
                })
                .then(productRes => console.log(productRes))
                .catch(err => {
                    console.log(err, "that")
                    setError("Something went wrong...")
                })
                
            });
            navigate('/checkout/confirmation')
        }
        catch(err) {
            console.log(err, "this")
            setError("Something went wrong...")
        }

    }

	async function displayRazorpay() {
		const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

		if (!res) {
			alert('Razorpay SDK failed to load. Are you online?')
			return
		}

		const response = await axios.post('http://localhost:5000/orders/payment', { amount: Number(contextData.order.total.total) * 100})

		console.log(response)

		const options = {
			key: 'rzp_test_H9dPEFJcZVfPVu',
			currency: 'INR',
			amount: response.data.amount,
			order_id: response.data.id,
			name: 'Shopping Cart',
			image: 'http://localhost:1337/logo.svg',
			handler: function (response) {
				submitOrder();
			},
			prefill: {
				name: user.username,
				email: user.email,
				contact: contextData.order.phone
			}
		}
		const paymentObject = new window.Razorpay(options)
		paymentObject.open()
	}

	return (
		// <div>
		// 	<header className="App-header">
				
		// 	</header>
		// </div>
        <div className='payment-form'>
            <div>
            <h6>Complete your payment with Razorpay</h6>
            Total: {contextData.order.total.total}<br/>
            Address: {contextData.order.address}<br/>
            Phone: {contextData.order.phone}<br/>
            <button
					className="razorpay-payment-button"
					onClick={displayRazorpay}
					target="_blank"
					rel="noopener noreferrer"
			>
					Pay with Razorpay
			</button>
            </div>
        </div>

	)
}

export default Razorpay