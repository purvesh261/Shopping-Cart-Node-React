import React, { useState, useEffect } from 'react';
import axios from 'axios';


function AddProduct() {
    const [product, setProduct] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        images: [],
    });
    const [alert, setAlert] = useState("");

    useEffect(() => {
        console.log(product);
    }, [product.images]);

    var validateFileExtension = (file) => {
        var allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
        return true;
    }


    var onChangeHandler = (event) => {
        let {name, value} = event.target;
        if(name === "images")
        {
            if(!value)
            {
                setProduct({...product, images: [value]});
            }
            else if(validateFileExtension(value))
            {
                setProduct({...product, [name]: value});
            }
            else
            {
                setAlert("Please upload a valid image file");
                setTimeout(() => setAlert(""), 2000);
            }
        }
        else
        {
            setProduct({...product, [name]: value});
        }
    }

    var onSubmitHandler = (event) => {
        event.preventDefault();
        console.log(product);
        var skipValidations = false;
        if(product.images == [] || product.images == null)
        {
            skipValidations = true;
        }

        if(!skipValidations && !validateFileExtension(product.images[0]))
        {
            setAlert("Please upload a valid image file");
            setTimeout(() => setAlert(""), 2000);
            return;
        }
        else
        {
            var formData = new FormData();
            formData.append('name', product.name);
            formData.append('price', product.price);
            formData.append('category', product.category);
            formData.append('description', product.description);
            formData.append('images', product.images[0]);

            axios.post('/products/create', formData)
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    return (
    <div className='product-form border' >
        <div className='head'>
            <h3>Add Product</h3>
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

            {/* <div className='form-group mb-3'>
                    <label>Quantity</label>
                    <input type="number" className='form-control' min="1" name="quantity" placeholder='Enter quantity'></input>
            </div> */}

            {/* <div className='form-group mb-3'>
                    <label>Supplier</label>
                    <input type="number" className='form-control' name="supplier" placeholder='Enter supplier'></input>
            </div> */}

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