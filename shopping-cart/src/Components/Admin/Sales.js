import React, { useState, useEffect, useContext } from 'react';
import { LoginDetails } from '../../App.js';
import { Link, useNavigate } from 'react-router-dom';
import '../../App.css';
import { Pagination } from '@mui/material';
import axios from 'axios';

function Sales() {
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState();
  const [tempSales, setTempSales] = useState([]);
  const [displayIndex, setDisplayIndex] = useState();
  const [deleteIndex, setDeleteIndex] = useState();
  const [alert, setAlert] = useState("");
  const [sort, setSort] = useState("Date: Descending");
  const contextData = useContext(LoginDetails);
  const navigate = useNavigate();
  const ROWS_PER_PAGE = 5;
  const [page, setPage] = useState(1);
  const [visibleSales, setVisibleSales] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  const onPageChange = (event, newPage) => {
      var start = (newPage-1) * ROWS_PER_PAGE
      setVisibleSales(tempSales.slice(start, start + ROWS_PER_PAGE));
      setPage(newPage);
      setDeleteIndex(null);
      setDisplayIndex(null);
      window.scrollTo(0, 0);
  }

  useEffect(() => {
      setVisibleSales(tempSales.slice(0, ROWS_PER_PAGE));
  }, [tempSales])

  useEffect(() => {
    getSales();
    }, []);

  var getSales = () => {
    axios.get('/orders/')
      .then(res => {
        setSales(res.data);
        setTempSales(res.data.sort((a, b) => (a.date < b.date) ? 1 : -1));
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  }

  const sortItems = (sort) => {
        setSort(sort);
        setPage(1);
        if(sort ===  "Date: Ascending")
        {
            setTempSales([ ...tempSales ].sort((a, b) => (a.date > b.date) ? 1 : -1));
        }
        else if(sort === "Date: Descending")
        {
            setTempSales([ ...tempSales ].sort((a, b) => (a.date < b.date) ? 1 : -1));
        }
        else if(sort === "Amount: Ascending")
        {
            setTempSales([ ...tempSales ].sort((a, b) => (Number(a.total.total) > Number(b.total.total)) ? 1 : -1));
        }
        else if(sort === "Amount: Descending")
        {
            setTempSales([ ...tempSales ].sort((a, b) => (Number(a.total.total) < Number(b.total.total)) ? 1 : -1));
        }
    }

  function formatDate(date) {
        const orderMonth = date.getMonth() + 1;
        const monthString = orderMonth >= 10 ? orderMonth : `0${orderMonth}`;
        const orderDate = date.getDate();
        const dateString = orderDate >= 10 ? orderDate : `0${orderDate}`;
        return `${dateString}/${monthString}/${date.getFullYear()}`;
    }


  var onDeleteYes = () => 
    {
        axios.delete(`/orders/${sales[deleteIndex]._id}/delete`)
            .then(res => {
                setLoading(true);
                getSales();
                setDeleteIndex(null);
            })
            .catch(err => {
                console.log("Error: " + err);
            })
    }


  return (
      <>
        <div className='row'>
            <div className='col-12'>
                <div className='head'>
                    <h2>Sales</h2>
                    <div className="sortAdmin">
                    <select value={sort} onChange={(e) => sortItems(e.target.value)}>
                        <option value="0">Sort by</option>
                        <option>Date: Ascending</option>
                        <option>Date: Descending</option>
                        <option>Amount: Ascending</option>
                        <option>Amount: Descending</option>
                    </select>
                    </div>
                </div>
                <div className="table-responsive">
                    {alert && <div className="alert alert-success m-3">{alert}</div>}
                    {deleteIndex != null &&
                        <div className="alert alert-danger m-3" role="alert">
                            <h5 className="alert-heading">Delete Sale</h5>
                            Are you sure you want to delete this order?<br/>
                            <button className='btn btn-danger my-3 mx-1 px-4' onClick={onDeleteYes}>Yes</button>
                            <button className='btn bg-white text-danger my-3 mx-1 px-4' onClick={() => setDeleteIndex(null)}>No</button>
                        </div>
                    }
                  <table className="table">
                      <thead className="bg-dark text-white">
                          <tr key="head">
                              <th scope="col">#</th> 
                              <th scope="col">User</th>
                              <th scope="col">Date</th>
                              <th scope="col">Amount</th>
                              <th scope="col">Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                      {
                          !loading ?
                            visibleSales.map((order, idx) => {
                                var key = (page - 1) * ROWS_PER_PAGE;
                                  return (
                                      <>
                                      <tr key={key + idx}>
                                          <td>{key + idx + 1}</td>
                                          <td>{order.user ? order.user.username : "[Deleted User]"}</td>
                                          <td>{formatDate(new Date(order.date))}</td>
                                          <td>??? {order.total.total}/-</td>
                                          <td>
                                              <button className='btn btn-primary btn-margin' onClick={() => displayIndex === key + idx? setDisplayIndex(null) : setDisplayIndex(key + idx)}>View Details</button>
                                              <button className='btn btn-danger btn-margin' onClick={() => setDeleteIndex(key + idx)}>Delete</button>
                                          </td>
                                      </tr>
                                      { displayIndex === key + idx?
                                          <tr key={-1}>
                                              <td colSpan="6" className='bg-secondary'>
                                                  <div className="card">
                                                      <div className="card-header">   
                                                          <h5>Order# {order._id} </h5>
                                                          
                                                      </div>
                                                      <div className="card-body">
                                                        <h6>User: {order.user ? order.user.username : "[Deleted User]"}</h6>
                                                        <h6>Phone: {order.phone}</h6>
                                                        <h6 className='m-0 p-0'>Address:</h6>
                                                        <div className='mb-1'>{order.address}</div>
                                                        <h6>Date: {formatDate(new Date(order.date))}</h6>
                                                        <h6>Total: ??? {order.total.total}/-</h6>
                                                        <div className="table-responsive">
                                                            <table className="table table-bordered">
                                                                <thead className="">
                                                                    <tr key="head">
                                                                        <th scope="col">#</th>
                                                                        <th scope="col">Product</th> 
                                                                        <th scope="col">Quantity</th>
                                                                        <th scope="col">Price</th>
                                                                        <th scope="col">Amount</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                {
                                                                    order.products.map((item, idx) => {
                                                                        return (
                                                                            <tr key={idx}>
                                                                                <td>{idx+1}</td>
                                                                                <td>{item.product? item.product.name : "[ Deleted Product ]"}</td>
                                                                                <td>{item.quantity}</td>
                                                                                {item.product? <td>??? {item.product.price }/-</td> : <td>[ Deleted Product ]</td>}
                                                                                {item.product? <td>??? {item.product.price * item.quantity}/-</td>: <td>[ Deleted Product ]</td>}
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }
                                                                <tr>
                                                                    <td colSpan="3" rowSpan="3"></td>
                                                                    <th>Amount</th>
                                                                    <th>??? {order.total.amount}/-</th>
                                                                </tr>
                                                                <tr>
                                                                    <th>Tax</th>
                                                                    <th>??? {order.total.tax}/-</th>
                                                                </tr>
                                                                <tr>
                                                                    <th>Total</th>
                                                                    <th>??? {order.total.total}/-</th>
                                                                </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
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
                    <Pagination
                        count={Math.ceil(tempSales.length / ROWS_PER_PAGE)} 
                        page={page}
                        onChange={onPageChange}
                        color="primary" 
                        sx={{ margin:"auto", mt:3,mb:3}}
                    />
                </div>
            </div>
        </div>
      </>

  )
}

export default Sales;