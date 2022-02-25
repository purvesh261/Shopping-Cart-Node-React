import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginDetails } from '../App';
import axios from 'axios';
import image from '../assets/img-prod.jpg';


function MyAccount() {
    const [ orders, setOrders ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const contextData = useContext(LoginDetails);
    const navigate = useNavigate();

    useEffect( () => {
        if(!contextData.loggedIn)
        {
            navigate("/login");
        }
        axios.get(`orders/${contextData.currentUser._id}/user`)
            .then(res => {
                setOrders([ ...res.data ]);
                setLoading(false)
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    function formatDate(date) {
        const mrMonth = date.getMonth();
        const monthString = mrMonth >= 10 ? mrMonth : `0${mrMonth}`;
        const mrDate = date.getDate();
        const dateString = mrDate >= 10 ? mrDate : `0${mrDate}`;
        return `${dateString}/${monthString}/${date.getFullYear()}`;
    }

    return (
    <>
        <div className="border color-primary cart-top">
            <h3>My Orders</h3>
        </div>
        {!loading ? 
        orders.map((item) => {
        return(
            <div className='card order-item'>
                <div className="card-header d-flex justify-content-between"><h5>Order# {item._id}</h5><h5 className='text-secondary'>Order Date: {formatDate(new Date(item.date))}</h5></div>
                <div className='card-body d-flex justify-content-between'>
                    <div>
                    <h5 className='text-color-primary'>Products</h5>
                        {item.products.map((product, idx) => {
                            return(
                                <>
                                    <p>
                                        {product.product ? <b>{product.product.name}</b> : <b className='text-danger'>[Deleted Product]</b>}<br/>
                                        Quantity: {product.quantity}<br/>
                                    </p>
                                </>
                            )
                        })}
                    </div>
                    <div>
                        <p className='text-secondary'>
                            Amount: ₹ {item.total.amount}/-<br/>
                            Tax: ₹ {item.total.tax}/-<br/>
                            Shipping: ₹ {item.total.shipping}/-<br/>
                        </p>
                        <h5 className='text-warning big'>Total: ₹ {item.total.total}/-</h5>
                    </div>
                </div>
            </div>    

      )})
      :
      <h3>Loading...</h3>
    }
    </>    
    )
}

export default MyAccount