import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import { LoginDetails } from '../App';
import defaultImage from '../assets/img-prod.jpg';

function ProductCard(props) {
    const contextData  = useContext(LoginDetails);
    const [quantity, setQuantity] = useState(1);
    const [productImage, setProductImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState({});

    let { product } = props;

    useEffect(() => {
        if(product.images.length > 0)
        {
            axios.get('/static/products/' + product._id + '/' + product.images[0], {responseType: 'blob', headers: {'Content-Type': 'image/jpeg'}})
            .then(res => {
                console.log(res.data);
                setProductImage(URL.createObjectURL(res.data));
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
            });
        }
        else    
        {
            setProductImage(defaultImage);
            setLoading(false);
            return () => {
                setState({}); 
              };
        }
    }, []);

    var addToCart = (event) =>
    {
        event.preventDefault();
        let found = false;
        for(let i = 0; i < contextData.cart.length; i++)
        {
            if(contextData.cart[i].product._id === product._id)
            {
                contextData.cart[i].quantity = Number(quantity);
                found = true;
                break;
            }
        }

        if(!found)
        {
            contextData.cart.push({product: product, quantity: Number(quantity)});
        }
        
        if(contextData.loggedIn)
        {
            contextData.currentUser.cart = contextData.cart;
            contextData.setCurrentUser(contextData.currentUser);
            contextData.updateCart(contextData);
        }

        contextData.setCart(contextData.cart);
        
    }

    return (
        <>
        <div className='col-12 col-md-6 col-lg-4'>
            <div className="card">

                { !loading && <img className="card-img-top" src={productImage != null ? productImage: defaultImage} alt="Card image cap" /> }
                <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text text-secondary">{product.description ? product.description : product.category}</p>
                    <h5 className="card-text">Price: ₹ {product.price}/-</h5>
                    {product.stock > 0? <h6 className='card-text'>{product.stock} left</h6> : <h6 className='card-text text-danger'>Out of stock</h6>}
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
                            <button type='submit' className={product.stock > 0 ? "rounded submit px-3 color-primary login-btn" : "rounded submit px-3 btn btn-secondary"} disabled={product.stock <= 0}>Add to Cart</button>
                            
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </>
    )
}

export default ProductCard;