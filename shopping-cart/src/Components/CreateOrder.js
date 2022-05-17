import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginDetails } from '../App';
import axios from 'axios';

function CreateOrder() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const contextData = useContext(LoginDetails);
    const user = JSON.parse(localStorage.getItem("user"));
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
                    setLoading(false);
                    setError("Something went wrong...")
                })
                
            });
            setLoading(false);
            navigate('/checkout/confirmation')
        }
        catch(err) {
            console.log(err, "this")
            setError("Something went wrong...")
            setLoading(false);
        }

    }

    useEffect(() => {
        submitOrder();
    }, [])
    return (
        <div>
            {loading &&
                <div className="spinner-border text-primary loading" role="status">
                    <span className="sr-only"></span>
                </div>
            }
            {error && <span>{error}</span>}
        </div>
    )
}

export default CreateOrder