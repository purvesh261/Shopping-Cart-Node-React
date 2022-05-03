import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginDetails } from '../../App.js';
import '../../App.css';
import { Pagination } from '@mui/material';
import axios from 'axios';

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [displayIndex, setDisplayIndex] = useState();
    const [edit, setEdit] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [alert, setAlert] = useState("");
    var [deleteIndex, setDeleteIndex] = useState();
    const navigate = useNavigate();
    const contextData = useContext(LoginDetails);
    const user = JSON.parse(localStorage.getItem('user'));
    const ROWS_PER_PAGE = 5;
    const [tempProducts, setTempProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [visibleProducts, setVisibleProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const onPageChange = (event, newPage) => {
        var start = (newPage-1) * ROWS_PER_PAGE
        setVisibleProducts(tempProducts.slice(start, start + ROWS_PER_PAGE));
        setPage(newPage);
        setDeleteIndex(null);
        setDisplayIndex(null);
        window.scrollTo(0,0);
    }

    useEffect(() => {
        setVisibleProducts(tempProducts.slice(0, ROWS_PER_PAGE));
    }, [tempProducts])

    var getProducts = () => {
        axios.get('/products/')
          .then(res => {
            setProducts(res.data);
            setTempProducts(res.data);
            setLoading(false);
          })
          .catch(err => {
            console.log(err);
          });
    }

    useEffect(() => {
        if(!user || !user.admin)
        {
            navigate("/login");
        }
        getProducts();
      }, []);
    
    var onChangeHandler = (event) => {
        let {name, value} = event.target;
        if(name === "status")
        {
           value = event.target.checked; 
        }
        setEditForm({...editForm, [name]: value});
    }

    var onSave = (event) => {
        event.preventDefault();
        axios.put(`/products/${editForm._id}/update`, editForm)
            .then(res => {
                setProducts(products.map((product, i) => {
                    if(i === displayIndex)
                    {
                        return {...product, ...editForm};
                    }
                    setAlert("Product updated successfully");
                    setTimeout(() => setAlert(""), 2000);
                    return product;
                }))
                setDisplayIndex(null);
            })
            .catch(err => {
                console.log("Error: " + err);
            });
    }

    var deleteProductFromCart = (productID) => {

        axios.put(`/users/${productID}/cart/remove`, {productID: productID})
            .then(res => {
            })
            .catch(err => {
                console.log(err);
            });
        };

    var deleteProductFromMR = async (productID) => {
        try{
            var res = await axios.put(`/mrinwards/${productID}/items/remove`);
        }
        catch(err)
        {
            console.log(err);
        }
    };

    var onDeleteYes = () => 
    {
        axios.delete(`/products/${products[deleteIndex]._id}/delete`)
            .then(res => {
                setLoading(true)
                getProducts()
                deleteProductFromMR(res.data._id)
                deleteProductFromCart(res.data._id)
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

    var displayDetails = (index) => {
        if(index === displayIndex)
        {
            setDisplayIndex(null);
            setEdit(false);
        }
        else
        {
            setDisplayIndex(index);
        }
    }

    var viewEditForm = (product) => {
        setEditForm(product);
        setEdit(true);
    }

    var search = (search) => {
        setSearchQuery(search);
        if(search === "")
        {
            setTempProducts([ ...products ]);
        }
        else
        {
            setTempProducts([ ...products ].filter((product) => product.name.toLowerCase().includes(search.toLowerCase()) || product._id === search));
        }
    }

    return (
        <>
        
            <div className='row'>
                <div className='col-12'>
                    <div className='head'>
                        <h2>Products</h2>
                        <Link to="/admin/products/new"><button className='btn btn-primary btn-create'>Add Product</button></Link>
                    </div>
                    <form>
                        <div className="input-group search justify-content-center">
                            <div className="form-outline w-75">
                            <input type="search" className="form-control p-2" placeholder='Search by product name or id' value={searchQuery} onChange={(e) => search(e.target.value)}/>
                            </div>
                            <button type="submit " className="rounded submit p-2 px-4 color-primary login-btn">
                            Search
                            </button>
                        </div>
                    </form>
                
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
                        
                        visibleProducts.map((product, idx) => {
                                var key = (page - 1) * ROWS_PER_PAGE;
                                return (
                                    <>
                                    <tr key={key + idx}>
                                        <td>{key + idx + 1}</td>
                                        <td>{product.name}</td>
                                        <td>₹ {product.price}/-</td>
                                        <td><input type="checkbox" checked={product.status} /></td>
                                        <td>
                                            <button className='btn btn-primary btn-margin' onClick={() => displayDetails(key + idx)}>View Details</button>
                                        </td>
                                        <td>
                                            <button className='btn btn-danger btn-margin' onClick={() => setDeleteIndex(key + idx)}>Delete</button>
                                        </td>
                                    </tr>
                                    { displayIndex === (key + idx)?
                                        <tr key="-1">
                                            <td colSpan="6" className='bg-secondary'>
                                                  <div className="card">
                                                      <div className="card-header d-flex justify-content-between">   
                                                          <h5>Product# {product._id}</h5>
                                                          <button className='btn btn-success btn-margin' onClick={() => viewEditForm(product)}>Edit</button>
                                                      </div>
                                                          
                                                      <div className="card-body">
                                                          {
                                                                edit ?
                                                                <form onSubmit={onSave}>
                                                                    <div className="form-group w-25 mb-3">
                                                                        <label htmlFor="name">Name</label>
                                                                        <input type="text" className="form-control" name="name" value={editForm.name} onChange={onChangeHandler} placeholder="Enter name" required/>
                                                                    </div>
                                                                    <div className="form-group w-25 mb-3">
                                                                        <label htmlFor="price">Price</label>
                                                                        <input type="number" className="form-control" name="price" value={editForm.price} onChange={onChangeHandler} placeholder="Enter price" required/>
                                                                    </div>
                                                                    <div className="form-group w-25 mb-3">
                                                                        <label htmlFor="stock">Stock</label>
                                                                        <input type="number" className="form-control" name="stock" value={editForm.stock} onChange={onChangeHandler} placeholder="Enter stock" required/>
                                                                    </div>
                                                                    <div className="form-group w-25 mb-3">
                                                                        <label htmlFor="description">Description</label>
                                                                        <textarea type="textarea" rows={5} className='form-control' name="description" value={editForm.description} onChange={onChangeHandler} placeholder='Write a description of the product' ></textarea>
                                                                    </div>
                                                                    <div className="form-group w-25 mb-3">
                                                                        <label htmlFor="category">Category</label>
                                                                        <input type="text" className="form-control" name="category" value={editForm.category} onChange={onChangeHandler} placeholder="Enter category" required/>
                                                                    </div>
                                                                    <div className="form-group mb-3">
                                                                        <label htmlFor="status">Status: </label>
                                                                        <input type="checkbox" className="form-check-input" name="status" checked={editForm.status} value={editForm.status} onChange={onChangeHandler} required/>
                                                                    </div>
                                                                    <button type="submit" className="btn btn-primary m-2">Save</button>
                                                                    <button type="button" className="btn btn-danger" onClick={() => setEdit(false)}>Cancel</button>
                                                                </form>
                                                                :
                                                                <>
                                                                    <h6>Product: {product.name}</h6>
                                                                    <h6>Price: ₹ {product.price}/-</h6>
                                                                    <h6>Quantity: {product.stock}</h6>
                                                                    <h6>Description: {product.description}</h6>
                                                                    <h6>Category: {product.category}</h6>
                                                                    <h6>Status: {product.status ? "Active" : "Disabled"}</h6>
                                                                    <h6>Created On: {formatDate(new Date(product.dateAdded))}</h6>
                                                                </>
                                                                

                                                          }
                                                        
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
                    <Pagination
                        count={Math.ceil(tempProducts.length / ROWS_PER_PAGE)} 
                        page={page}
                        onChange={onPageChange}
                        color="primary" 
                        sx={{ margin:"auto", mt:3,mb:3}}
                    />
                    </tbody>
                    
                </table>
                </div>
                    </div>
            </div>

            
            
        </>
    )
}

export default AdminProducts;