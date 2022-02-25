import React, { useState, useEffect, useContext } from 'react';
import { LoginDetails } from '../../App.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function AddProduct() {
    const [product, setProduct] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        images: [],
    });
    const [alert, setAlert] = useState("");
    const contextData = useContext(LoginDetails);
    const navigate = useNavigate();

    useEffect(() => {
        if(!contextData.loggedIn || !contextData.currentUser.admin)
        {
            navigate("/login");
        }
    }, [product.images]);

    var validateFileExtension = (file) => {
        var allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
        return true;
    }


    var onChangeHandler = (event) => {
        let {name, value} = event.target;
        if(name === "images")
        {
            const file = event.target.files[0];

            if(file === undefined) {
            } 
            else if(file.type === "image/png" || file.type === "image/jpeg")
            {
                setProduct({...product, [name]: file});
            }
            else {
                setAlert("Please upload a valid image file");
                setTimeout(() => {
                    setAlert("");
                }, 3000);
            }
        }
        else
        {
            setProduct({...product, [name]: value});

        }
    }

    var onSubmitHandler = (event) => {
        event.preventDefault();
        var formData = new FormData();
        formData.append('name', product.name);
        formData.append('price', product.price);
        formData.append('category', product.category);
        formData.append('description', product.description);
        formData.append('images', product.images);
        axios.post('/products/create', formData)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
        navigate('/admin/products');
    }

    return (
    <div className='product-form border' >
        <div className='head'>
            <h3>Add Product</h3>
            {alert && <div className="alert alert-danger" role="alert">
              {alert}
            </div>}
        </div>
        {alert && <div className="alert alert-danger" role="alert">
              {alert}
            </div>}
        <form onSubmit={onSubmitHandler}>
            <div className='form-group mb-3'>
                <label>Product Name</label>
                <input type="text" className='form-control' name="name" value={product.name} onChange={onChangeHandler} placeholder='Enter product name' required></input>
            </div>
        
            <div className='form-group mb-3'>
                <label>Price</label>
                <input type="number" className='form-control' min="1" name="price" value={product.price} onChange={onChangeHandler} placeholder='Enter price' required></input>
            </div>

            <div className='form-group mb-3'>
                    <label>Category</label>
                    <input type="text" className='form-control' name="category" value={product.category} onChange={onChangeHandler} placeholder='Enter category' required></input>
            </div>

            <div className='form-group mb-3'>
                <label>Description</label>
                <textarea type="textarea" rows={5} className='form-control' name="description" value={product.description} onChange={onChangeHandler} placeholder='Write a description of the product' ></textarea>
            </div>

            <div className='form-group mb-3'>
                <label>Image</label>
                <input type="file" className='form-control' onChange={onChangeHandler} name="images" placeholder='Upload an image'></input>
            </div>

            <div className='form-group mb-3'>
                <input type="submit" className='form-control btn btn-primary' value="Submit"></input>
            </div>
        </form>
    </div>
    )
}

export default AddProduct