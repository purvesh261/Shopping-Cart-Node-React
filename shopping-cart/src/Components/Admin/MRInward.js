import React, { useState, useEffect, useContext } from 'react';
import { LoginDetails } from '../../App.js';
import { Link, useNavigate } from 'react-router-dom';
import '../../App.css';
import { Pagination } from '@mui/material';
import axios from 'axios';

function MRInward() {
    const [loading, setLoading] = useState(true);
    const [MRInward, setMRInward] = useState();
    const [tempMRs, setTempMRs] = useState([]);
    const [displayIndex, setDisplayIndex] = useState();
    const [deleteIndex, setDeleteIndex] = useState();
    const [sort, setSort] = useState("Date: Descending");
    const contextData = useContext(LoginDetails);
    const navigate = useNavigate();
    const [alert, setAlert] = useState("");
    const ROWS_PER_PAGE = 5;
    const [page, setPage] = useState(1);
    const [visibleMRs, setVisibleMRs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    var getMRInwards = () => {
    axios.get('/mrinwards/')
        .then(res => {
            setMRInward(res.data);
            setTempMRs(res.data.sort((a, b) => (a.MRInwardDate < b.MRInwardDate) ? 1 : -1));

            setLoading(false);
        })
        .catch(err => {
            console.log(err);
        });
    }

    function formatDate(date) {
        const mrMonth = date.getMonth();
        const monthString = mrMonth >= 10 ? mrMonth : `0${mrMonth}`;
        const mrDate = date.getDate();
        const dateString = mrDate >= 10 ? mrDate : `0${mrDate}`;
        return `${dateString}/${monthString}/${date.getFullYear()}`;
    }

    useEffect(() => {
        setVisibleMRs(tempMRs.slice(0, ROWS_PER_PAGE));
    }, [tempMRs]);

    const onPageChange = (event, newPage) => {
        var start = (newPage-1) * ROWS_PER_PAGE
        setVisibleMRs(tempMRs.slice(start, start + ROWS_PER_PAGE));
        setPage(newPage);
        setDeleteIndex(null);
        setDisplayIndex(null);
        window.scrollTo(0, 0);
    }

    useEffect(() => {
      getMRInwards();
    }, []);

    var onDeleteYes = async () => 
    {
        try{
            var response = await axios.delete(`/mrinwards/${MRInward[deleteIndex]._id}/delete`);
            setAlert("MR# " + response.data.MRInwardNo + " deleted successfully");
            setTimeout(() => { setAlert(""); }, 2000);
            setLoading(true)
            getMRInwards()
            setDeleteIndex(null);
        }
        catch(err)
        {
            console.log(err);
        }
    }

    const sortItems = (sort) => {
        setSort(sort);
        setPage(1);
        if(sort ===  "Date: Ascending")
        {
            setTempMRs([ ...tempMRs ].sort((a, b) => (a.MRInwardDate > b.MRInwardDate) ? 1 : -1));
        }
        else if(sort === "Date: Descending")
        {
            setTempMRs([ ...tempMRs ].sort((a, b) => (a.MRInwardDate < b.MRInwardDate) ? 1 : -1));
        }
        else if(sort === "Amount: Ascending")
        {
            setTempMRs([ ...tempMRs ].sort((a, b) => (Number(a.MRInwardTotal) > Number(b.MRInwardTotal)) ? 1 : -1));
        }
        else if(sort === "Amount: Descending")
        {
            setTempMRs([ ...tempMRs ].sort((a, b) => (Number(a.MRInwardTotal) < Number(b.MRInwardTotal)) ? 1 : -1));
        }
        else if(sort === "Supplier: Ascending")
        {
            setTempMRs([ ...tempMRs ].sort((a, b) => a.Supplier.toLowerCase() > b.Supplier.toLowerCase() ? 1 : -1));
        }
        else if(sort === "Supplier: Descending")
        {
            setTempMRs([ ...tempMRs ].sort((a, b) => a.Supplier.toLowerCase() < b.Supplier.toLowerCase() ? 1 : -1));
        }
    }

    return (
      <>
        <div className='row'>
            <div className='col-12'>
                <div className='head'>
                    <h2>MR Inward</h2>
                    <div className="sortAdmin">
                    <select value={sort} onChange={(e) => sortItems(e.target.value)}>
                        <option value="0">Sort by</option>
                        <option>Date: Ascending</option>
                        <option>Date: Descending</option>
                        <option>Amount: Ascending</option>
                        <option>Amount: Descending</option>
                        <option>Supplier: Ascending</option>
                        <option>Supplier: Descending</option>
                    </select>
                    <Link to="/admin/mrinward/new"><button className='btn btn-primary btn-create'>Create MR</button></Link>
                    </div>
                </div>
                <div className="table-responsive">
                    {alert && <div className="alert alert-success m-3">{alert}</div>}
                    {deleteIndex != null &&
                        <div className="alert alert-danger m-3" role="alert">
                            <h5 className="alert-heading">Delete MR</h5>
                            Are you sure you want to delete this MR?<br/>
                            <button className='btn btn-danger my-3 mx-1 px-4' onClick={onDeleteYes}>Yes</button>
                            <button className='btn bg-white text-danger my-3 mx-1 px-4' onClick={() => setDeleteIndex(null)}>No</button>
                        </div>
                    }
                  <table className="table">
                      <thead className="bg-dark text-white">
                          <tr key="head">
                              <th scope="col">#</th> 
                              <th scope="col">MR No</th>
                              <th scope="col">Date</th>
                              <th scope="col">Supplier</th>
                              <th scope="col">Total</th>
                              <th scope="col">Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                      {
                          !loading ?
                            visibleMRs.map((mrinward, idx) => {
                                var key = (page - 1) * ROWS_PER_PAGE;
                                  return (
                                      <>
                                      <tr key={key+idx}>
                                          <td>{key+idx+1}</td>
                                          <td>{mrinward.MRInwardNo}</td>
                                          <td>{formatDate(new Date(mrinward.MRInwardDate))}</td>
                                          <td>{mrinward.Supplier}</td>
                                          <td>₹ {mrinward.MRInwardTotal}</td>
                                          <td>
                                              <button className='btn btn-primary btn-margin' onClick={() => displayIndex === key + idx? setDisplayIndex(null) : setDisplayIndex(key + idx)}>View Details</button>
                                              <button className='btn btn-danger btn-margin' onClick={() => setDeleteIndex(key + idx)}>Delete</button>
                                          </td>
                                      </tr>
                                      { displayIndex === key + idx?
                                          <tr key={-1}>
                                              <td colSpan="6" className='bg-secondary'>
                                                  <div className="card">
                                                      <div className="card-header d-flex justify-content-between">   
                                                          <h5>MR Details</h5>
                                                          <Link to={`/admin/mrinward/${mrinward._id}/edit/`}><button className='btn btn-success btn-margin'>Edit</button></Link>
                                                      </div>
                                                      <div className="card-body">
                                                        <h6>MR No: {mrinward.MRInwardNo}</h6>
                                                        <h6>Date: {formatDate(new Date(mrinward.MRInwardDate))}</h6>
                                                        <h6>Supplier: {mrinward.Supplier}</h6>
                                                        <h6>Total: ₹ {mrinward.MRInwardTotal}/-</h6>
                                                        <div className="table-responsive">
                                                            <table className="table table-bordered">
                                                                <thead className="">
                                                                    <tr key="head">
                                                                        <th scope="col">#</th>
                                                                        <th scope="col">Product</th> 
                                                                        <th scope="col">Quantity</th>
                                                                        <th scope="col">Rate</th>
                                                                        <th scope="col">Amount</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                {
                                                                    mrinward.MRInwardItems.map((item, idx) => {
                                                                        return (
                                                                            <tr key={idx}>
                                                                                <td>{idx+1}</td>
                                                                                <td>{item.product.name}</td>
                                                                                <td>{item.quantity}</td>
                                                                                <td>₹ {item.rate}</td>
                                                                                <td>₹ {item.amount}</td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }
                                                                {
                                                                    mrinward.RemovedMRInwardItems.map((item, idx) => {
                                                                        return (
                                                                            <tr key={idx} className="text-danger">
                                                                                <td>{idx+1}</td>
                                                                                <td>{item.product + " [Deleted Product]"}</td>
                                                                                <td>{item.quantity}</td>
                                                                                <td>₹ {item.rate}</td>
                                                                                <td>₹ {item.amount}</td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }
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
                        count={Math.ceil(tempMRs.length / ROWS_PER_PAGE)} 
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

export default MRInward