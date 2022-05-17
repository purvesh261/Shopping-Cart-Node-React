import React, { useState, useEffect, useContext } from 'react';
import CreateUser from './CreateUser';
import { useNavigate } from 'react-router-dom';
import '../../App.css'
import axios from 'axios';
import { Typography, Pagination, Button } from '@mui/material';

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editIndex, setEditIndex] = useState();
    const [editForm, setEditForm] = useState({username:"", email:"", admin:false, status:false});
    const [alert, setAlert] = useState("");
    const [userAdded, setUserAdded] = useState(false);
    const navigate = useNavigate();
    var [deleteIndex, setDeleteIndex] = useState();
    const ROWS_PER_PAGE = 5;
    const [tempUsers, setTempUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [visibleUsers, setVisibleUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sort, setSort] = useState("Date: Descending");
    const user = JSON.parse(localStorage.getItem('user'));

    const onPageChange = (event, newPage) => {
        var start = (newPage-1) * ROWS_PER_PAGE
        setVisibleUsers(tempUsers.slice(start, start + ROWS_PER_PAGE));
        setPage(newPage);
        setDeleteIndex(null);
        setEditIndex(null);
        window.scrollTo(0,0);
    }

    useEffect(() => {
        setVisibleUsers(tempUsers.slice(0, ROWS_PER_PAGE));
    }, [tempUsers])



    var getUsers = () => {
        axios.get('/users/')
          .then(res => {
            setUsers(res.data)
            setTempUsers(res.data)
            setLoading(false);
          })
          .catch(err => {
            console.log(err);
          });
    }
    useEffect(() => {
        getUsers();
      }, [userAdded]);
    
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
                {username:visibleUsers[index].username,
                email:visibleUsers[index].email,
                admin:visibleUsers[index].admin,
                status:visibleUsers[index].status}
            );
        }
    }

    var onSave = (event) => {
        event.preventDefault();
        axios.put(`/users/${users[editIndex]._id}/update`, editForm)
            .then(res => {
                setUsers(users.map((user, i) => {
                    if(i === editIndex)
                    {
                        return {...user, ...editForm};
                    }
                    setAlert("User updated successfully");
                    setTimeout(() => setAlert(""), 2000);
                    return user;
                }))
                setEditIndex(null);
            })
            .catch(err => {
                console.log("Error: " + err);
            });
    }

    var onDeleteYes = () => 
    {
        axios.delete(`/users/${users[deleteIndex]._id}/delete`)
            .then(res => {
                setLoading(true);
                getUsers();
                setDeleteIndex(null);
            })
            .catch(err => {
                console.log("Error: " + err);
            })
    }

    var search = (search) => {
        setSearchQuery(search);
        if(search === "")
        {
            setTempUsers([ ...users ]);
        }
        else
        {
            setTempUsers([ ...users ].filter((user) => user.username.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase())));
        }
    
      }

    return (
        <>
        
            <div className='row'>
                <div className='col-md-4 col-sm-12 nopadding'>
                    <CreateUser setUserAdded={setUserAdded} userAdded={userAdded}/>
                </div>
                <div className='col-md-8 col-sm-12 mt-5'>
                    <h3>Users</h3>
                    <form>
                        <div className="input-group search justify-content-center">
                            <div className="form-outline w-75">
                            <input type="search" className="form-control p-2" placeholder='Search by username or email' value={searchQuery} onChange={(e) => search(e.target.value)}/>
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
                            <h5 className="alert-heading">Delete User</h5>
                            Are you sure you want to delete this user?<br/>
                            <button className='btn btn-danger my-3 mx-1 px-4' onClick={onDeleteYes}>Yes</button>
                            <button className='btn bg-white text-danger my-3 mx-1 px-4' onClick={() => setDeleteIndex(null)}>No</button>
                        </div>
                    }
                <table className="table">
                    <thead className="bg-dark text-white">
                        <tr key="head">
                            <th scope="col">#</th> 
                            <th scope="col">Username</th>
                            <th scope="col">Email</th>
                            <th scope="col">Admin</th>
                            <th scope="col">Status</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        !loading ?
                        <>
                        
                            {visibleUsers.map((user, idx) => {
                                var key = (page - 1) * ROWS_PER_PAGE;
                                return (
                                    <>
                                    <tr key={key + idx}>
                                        <td>{key + idx + 1}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td><input type="checkbox" checked={user.admin} /></td>
                                        <td><input type="checkbox" checked={user.status} /></td>
                                        <td>
                                            <button className='btn btn-primary btn-margin' onClick={() => editIndex === key + idx? editUser(null): editUser(key + idx)}>Edit</button>
                                            <button className='btn btn-danger btn-margin' onClick={() => setDeleteIndex(key + idx)}>Delete</button>
                                        </td>
                                    </tr>
                                    { editIndex === (key + idx)?
                                        <tr key="-1">
                                            <td colSpan="6" className='p-3'>
                                                <form onSubmit={onSave}>
                                                    <div className="form-group mb-2">
                                                        <label>Username</label>
                                                        <input type="text" className="form-control w-25" value={editForm.username} onChange={onChangeHandler} name="username" placeholder="Username" />
                                                    </div>
                                                    <div className="form-group mb-2">
                                                        <label>Email</label>
                                                        <input type="email" className="form-control w-25" value={editForm.email} onChange={onChangeHandler} name="email" placeholder="Email" />
                                                    </div>
                                                    <div className="form-group mb-2">
                                                        <label>Admin: </label>
                                                        <input type="checkbox" checked={editForm.admin} onChange={onChangeHandler} name="admin" />
                                                    </div>
                                                    <div className="form-group mb-2">
                                                        <label>Status:</label>
                                                        <input type="checkbox" checked={editForm.status} onChange={onChangeHandler} name="status" />
                                                    </div>
                                                    <input type="submit" className="btn btn-primary px-4" value="Save"/>
                                                </form>
                                            </td>
                                        </tr>
                                    : null}
                                    </>
                                    
                                    )
                                })}
                                <Pagination
                                    count={Math.ceil(tempUsers.length / ROWS_PER_PAGE)} 
                                    page={page}
                                    onChange={onPageChange}
                                    color="primary" 
                                    sx={{ margin:"auto", mt:3,mb:3}}
                                />
                                </>
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

export default AdminUsers;