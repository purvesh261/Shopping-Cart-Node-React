import React, { useContext, useState, useEffect } from 'react';
import { LoginDetails } from '../App';
import image from '../assets/img-prod.jpg';

function ProductCard(props) {
    const loginSettings  = useContext(LoginDetails);
    const [quantity, setQuantity] = useState(1);
    let { product } = props;


    var addToCart = (event) =>
    {
        event.preventDefault();
        let found = false;
        for(let i = 0; i < loginSettings.cart.length; i++)
        {
            if(loginSettings.cart[i].product._id === product._id)
            {
                loginSettings.cart[i].quantity = Number(quantity);
                found = true;
                break;
            }
        }
        if(!found)
        {
            loginSettings.cart.push({product: product, quantity: Number(quantity)});
        }
        
        if(loginSettings.loggedIn)
        {
            loginSettings.currentUser.cart = loginSettings.cart;
            loginSettings.setCurrentUser(loginSettings.currentUser);
            loginSettings.updateCart(loginSettings);
        }
        console.log(loginSettings.cart);
        console.log(loginSettings.currentUser);

        loginSettings.setCart(loginSettings.cart);
        
    }
    return (
        <>
        <div className='col-12 col-md-6 col-lg-4'>
            <div className="card">
                <img src={image} alt="Product image" className="card-img-top"/>
                <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.description}</p>
                    <p className="card-text">{product.price}</p>
                    <form onSubmit={addToCart}>
                        <div className="input-group">
                            <div className="form-outline">
                                <select className='form-control' name='quantity' value={quantity} onChange={(e) => setQuantity(e.target.value)}>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </select>
                            </div>
                            <button type='submit' className="rounded submit px-3 color-primary login-btn">Add to cart</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </>
    )
}

export default ProductCard;