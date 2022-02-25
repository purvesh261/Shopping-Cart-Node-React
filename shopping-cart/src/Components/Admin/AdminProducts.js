import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';
import axios from 'axios';

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editIndex, setEditIndex] = useState();
    const [editForm, setEditForm] = useState({});
    const [alert, setAlert] = useState("");
    var [deleteIndex, setDeleteIndex] = useState();

    var getProducts = () => {
        axios.get('/products/')
          .then(res => {
            setProducts(res.data)
            setLoading(false);
            console.log("data", res.data)
          })
          .catch(err => {
            console.log(err);
          });
    }

    useEffect(() => {
      getProducts();
      }, []);
    
    var onChangeHandler = (event) => {
        let {name, value} = event.target;
        if(name === "admin" || name === "status")
        {
           value = event.target.checked; 
        }
        setEditForm({...editForm, [name]: value});
    }

    var editUser = (index) => {
        setEditIndex(index);
        if(index != null)
        {
            setEditForm(
                {}
            );
        }
    }

    var onSave = (event) => {
        event.preventDefault();
        axios.put(`/products/${products[editIndex]._id}/update`, editForm)
            .then(res => {
                setProducts(products.map((product, i) => {
                    if(i === editIndex)
                    {
                        return {...product, ...editForm};
                    }
                    setAlert("Product updated successfully");
                    setTimeout(() => setAlert(""), 2000);
                    return product;
                }))
                setEditIndex(null);
            })
            .catch(err => {
                console.log("Error: " + err);
            });
    }

    var onDeleteYes = () => 
    {
        axios.delete(`/products/${products[deleteIndex]._id}/delete`)
            .then(res => {
                setLoading(true)
                getProducts()
                setDeleteIndex(null);
            })
            .catch(err => {
                console.log("Error: " + err)
            })
    }

    var onDeleteNo = () =>
    {
        setDeleteIndex(null);
    }

    function formatDate(date) {
        const orderMonth = date.getMonth() + 1;
        const monthString = orderMonth >= 10 ? orderMonth : `0${orderMonth}`;
        const orderDate = date.getDate();
        const dateString = orderDate >= 10 ? orderDate : `0${orderDate}`;
        return `${dateString}/${monthString}/${date.getFullYear()}`;
    }


    return (
        <>
        
            <div className='row'>
                <div className='col-12'>
                    <div className='head'>
                        <h2>Products</h2>
                        <Link to="/admin/products/new"><button className='btn btn-primary btn-create'>Add Product</button></Link>
                    </div>
                
                    <div className="table-responsive">
                    {alert && <div className="alert alert-success m-3">{alert}</div>}
                    {deleteIndex != null &&
                        <div className="alert alert-danger m-3" role="alert">
                            <h5 className="alert-heading">Delete Product</h5>
                            Are you sure you want to delete this product?<br/>
                            <button className='btn btn-danger my-3 mx-1 px-4' onClick={onDeleteYes}>Yes</button>
                            <button className='btn bg-white text-danger my-3 mx-1 px-4' onClick={onDeleteNo}>No</button>
                        </div>
                    }
                <table className="table">
                    <thead className="bg-dark text-white">
                        <tr key="head">
                            <th scope="col">#</th> 
                            <th scope="col">Name</th>
                            <th scope="col">Price</th>
                            <th scope="col">Status</th>
                            <th scope="col">Details</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        !loading ?
                        
                          products.map((product, idx) => {
                                return (
                                    <>
                                    <tr key={idx}>
                                        <td>{idx+1}</td>
                                        <td>{product.name}</td>
                                        <td>₹ {product.price}/-</td>
                                        <td><input type="checkbox" checked={product.status} /></td>
                                        <td>
                                            <button className='btn btn-primary btn-margin' onClick={() => editIndex === idx? setEditIndex(null) : setEditIndex(idx)}>View Details</button>
                                        </td>
                                        <td>
                                            <button className='btn btn-danger btn-margin' onClick={() => setDeleteIndex(idx)}>Delete</button>
                                        </td>
                                    </tr>
                                    { editIndex === idx?
                                        <tr key="-1">
                                            <td colSpan="6" className='bg-secondary'>
                                                  <div className="card">
                                                      <div className="card-header">   
                                                          <h5>Product</h5>
                                                          
                                                      </div>
                                                      <div className="card-body">
                                                        <h6>Product: {product.name}</h6>
                                                        <h6>Price: ₹ {product.price}/-</h6>
                                                        <h6>Quantity: {product.stock}</h6>
                                                        <h6>Description: {product.description}</h6>
                                                        <h6>Category: {product.category}</h6>
                                                        <h6>Status: {product.status ? "Active" : "Disabled"}</h6>
                                                        <h6>Created On: {formatDate(new Date(product.dateAdded))}</h6>
                                                    </div>
                                                    </div>
                                                
                                            </td>
                                        </tr>
                                    : null}
                                    </>
                                    
                                )
                            })
                        :
                        <tr key="-1">
                            <td colSpan={6} className="text-center text-secondary p-5">
                                <div className="spinner-border text-dark" role="status">
                                    <span className="sr-only"></span>
                                </div>
                            </td>
                        </tr>
                    }
                    </tbody>
                    
                </table>
                </div>
                    </div>
            </div>

            
            
        </>
    )
}

export default AdminProducts;