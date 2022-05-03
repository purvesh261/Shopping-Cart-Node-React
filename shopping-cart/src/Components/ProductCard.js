import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import { LoginDetails } from '../App';
import defaultImage from '../assets/img-prod.jpg';
import { Typography, Rating, Stack, Box } from '@mui/material';
import Modal from '@mui/material/Modal';
import ProductReviews from './ProductReviews';

const modalStyle = theme => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: 0,
    boxShadow: 24,
    p: 4,
    [theme.breakpoints.down('sm')]: {
        margin: "auto",
        mt:2,
        width: "95%",
    }
  });

function ProductCard(props) {
    const contextData  = useContext(LoginDetails);
    const [quantity, setQuantity] = useState(1);
    const [productImage, setProductImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviewOpen, setReviewOpen] = useState(false);
    const handleReviewOpen = () => setReviewOpen(true);
    const handleReviewClose = () => setReviewOpen(false);
    const user = JSON.parse(localStorage.getItem("user"));
    const { product } = props;
    
    const getProductImage = (product) => {
        var image = null;
        if("images" in product && product.images !== null)
        {
            axios.get(`/static/products/${product._id}/${product.images}`, {responseType: 'blob', headers: {'Content-Type': 'image/jpeg'}})
            .then(res => {
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
        }
      }

    useEffect(() => {
        getProductImage(product);
    }, [props.reRender]);

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

                { !loading ? <img className="card-img-top" src={productImage} alt="Card image cap" /> : <span>loading...</span> }
                <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text text-secondary">{product.description ? product.description : product.category}</p>
                    <h5 className="card-text">Price: ₹ {product.price}/-</h5>
                    {product.stock > 0? <h6 className='card-text'>{product.stock} left</h6> : <h6 className='card-text text-danger'>Out of stock</h6>}
                    <Stack direction="row" sx={{mb:1}}>
                        <Rating name="read-only" value={Number(product.averageRating)} precision={0.25} readOnly />
                        <Typography variant="body2" noWrap color="text.secondary" sx={{ml:1}}>
                        {product.averageRating}/5
                        </Typography>
                    </Stack>
                    <button onClick={handleReviewOpen} className="rounded submit pl-3 mb-2 color-primary login-btn">Rate</button>
                    <form onSubmit={addToCart}>
                        <div className="input-group">
                            <div className="form-outline">
                                <select className='form-control' name='quantity' value={quantity} onChange={(e) => setQuantity(e.target.value)}>
                                    { [1,2,3,4,5,6,7,8,9,10].map(i => {
                                        if (i > product.stock){
                                            return null;
                                        }
                                        return <option key={i} value={i}>{i}</option>
                                    })
                                    }
                                </select>
                            </div>
                            <button type='submit' className={product.stock > 0 ? "rounded submit px-3 color-primary login-btn" : "rounded submit px-3 btn btn-secondary"} disabled={product.stock <= 0}>Add to Cart</button>    
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <Modal
            open={reviewOpen}
            onClose={handleReviewClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                {/* <Typography id="modal-modal-title" variant="h5" component="h2">
                    Reviews
                </Typography>
                <Typography id="modal-modal-subtitle" variant="h6" component="h2">
                    Your review
                </Typography>
                <Typography id="modal-modal-subtitle" variant="h6" component="h2">
                    User reviews
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    
                </Typography> */}
                <ProductReviews product={product}/>
            </Box>
        </Modal>
        </>
    )
}

export default ProductCard;