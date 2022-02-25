import React, { useState, useEffect, useContext } from 'react';
import { LoginDetails } from '../../App.js';
import { Link, useNavigate } from 'react-router-dom';
import '../../App.css';
import axios from 'axios';

function MRInward() {
    const [loading, setLoading] = useState(true);
    const [MRInward, setMRInward] = useState();
    const [displayIndex, setDisplayIndex] = useState();
    const [deleteIndex, setDeleteIndex] = useState();
    const contextData = useContext(LoginDetails);
    const navigate = useNavigate();
    const [alert, setAlert] = useState("");

    var getMRInwards = () => {
    axios.get('/mrinwards/')
        .then(res => {
        setMRInward(res.data)
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
    if(!contextData.loggedIn || !contextData.currentUser.admin)
    {
        navigate("/login");
    }
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

    return (
      <>
        <div className='row'>
            <div className='col-12'>
                <div className='head'>
                    <h2>MR Inward</h2>
                    <Link to="/admin/mrinward/new"><button className='btn btn-primary btn-create'>Create MR</button></Link>
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
                            MRInward.map((mrinward, idx) => {
                                  return (
                                      <>
                                      <tr key={idx}>
                                          <td>{idx+1}</td>
                                          <td>{mrinward.MRInwardNo}</td>
                                          <td>{formatDate(new Date(mrinward.MRInwardDate))}</td>
                                          <td>{mrinward.Supplier}</td>
                                          <td>₹ {mrinward.MRInwardTotal}</td>
                                          <td>
                                              <button className='btn btn-primary btn-margin' onClick={() => displayIndex === idx? setDisplayIndex(null) : setDisplayIndex(idx)}>View Details</button>
                                              <button className='btn btn-danger btn-margin' onClick={() => setDeleteIndex(idx)}>Delete</button>
                                          </td>
                                      </tr>
                                      { displayIndex === idx?
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
                </div>
            </div>
        </div>
      </>

  )
}

export default MRInward