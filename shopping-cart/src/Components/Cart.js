import React, { useContext, useEffect, useState } from 'react';
import { LoginDetails } from '../App';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
function Cart() {
  const contextData = useContext(LoginDetails);
  const { cart } = contextData;
  const [total, setTotal] = useState({amount:0 ,tax:0, shipping:0, total:0});
  const navigate = useNavigate();

  var getTotal = () =>
  {
    var newAmount = 0;
    for (let i = 0; i < cart.length; i++) {
      newAmount += cart[i].product.price * cart[i].quantity;
    }
    var newTax = Number(newAmount * 0.1).toFixed(2);
    var newShipping = 150;
    var newTotal = Number(newAmount) + Number(newTax) + Number(newShipping);
    newTotal = Number(newTotal).toFixed(2);
    setTotal({amount:newAmount, tax:newTax, shipping:newShipping, total:newTotal});
  }

  useEffect(() => {
    getTotal();
  }, []);


  var changeQuantity = (event, index) => {
    cart[index].quantity = Number(event.target.value);
    contextData.setCart(cart);
    if(contextData.loggedIn)
    {
        contextData.currentUser.cart = cart;
        contextData.setCurrentUser(contextData.currentUser);
        contextData.updateCart(contextData)
    }
    getTotal();
  };

  var removeItem = (index) => {
    cart.splice(index, 1);
    contextData.setCart(cart);
    if(contextData.loggedIn)
    {
        contextData.currentUser.cart = cart;
        contextData.setCurrentUser(contextData.currentUser);
        contextData.updateCart(contextData)
    }
    getTotal();
  };
  
  var checkOut = () =>
  {
    contextData.total = total;
    contextData.loggedIn ? navigate('/checkout') : navigate('/login');
  }
  return (
    <>
    <div className="border color-primary cart-top">
      <h3>Cart</h3>
    </div>
    
   
    {cart.map((item, index) => {
        return(
        <div key={index} className="border cart-item">
            <div className="cart-item-details">
                <h4 className='text-color-primary'>{item.product.name}</h4>
                <h5>Price: ₹ {item.product.price}</h5>
                  <form className='form-inline'>
                    <label htmlFor='quantity'><h5>Quantity:</h5></label>
                    <select className='form-control cart-quantity' name='quantity' value={item.quantity} onChange={(e) => changeQuantity(e, index)}>
                    { [1,2,3,4,5,6,7,8,9,10].map(i =>{
                        if (i > item.product.stock){
                            return null;
                        }
                        return <option key={i} value={i}>{i}</option>
                        })
                    }
                    </select>

                  </form>
                  <h5>Subtotal: <span className='text-warning'>₹ {item.product.price * item.quantity}</span></h5>
                  <button className='btn btn-danger' onClick={() => removeItem(index)}>Remove</button>
            </div>
        </div>

      )}
    )}
    {
      cart.length > 0 ?
      <div className="border cart-total">
        <div className="row flex-nowrap">
          <div className="offset-sm-0 col-md-2 offset-md-8 col-3 text-secondary">
            <h5>Subtotal</h5>
            <h5>Tax</h5>
            <h5>Shipping</h5>
            <h4 className='text-black'>Total</h4>
          </div>
          <div className="col-md-2">
            <h5>₹ {total.amount}</h5>
            <h5>₹ {total.tax}</h5>
            <h5>₹ {total.shipping}</h5>
            <h4 className='text-warning'>₹ {total.total}</h4>
          </div>
        </div>
        <button className="btn btn-warning offset-8" onClick={checkOut}>{contextData.loggedIn? "Proceed to Checkout": "Login and Checkout"}</button>
      </div>
      :
      <div className="border text-center cart-total">
        <h4>Cart is empty</h4>
        <Link to="/"><button className="rounded submit p-2 px-4 color-primary login-btn m-3">Continue Shopping</button></Link>
      </div>
    }
    </>
  )
}

export default Cart;