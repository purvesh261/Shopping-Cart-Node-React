import React, { useState, useEffect } from 'react';
import CreateUser from './CreateUser';
import '../../App.css'
import axios from 'axios';

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editIndex, setEditIndex] = useState();
    const [editForm, setEditForm] = useState({username:"", email:"", admin:false, status:false});
    const [alert, setAlert] = useState("");
    const [userAdded, setUserAdded] = useState(false);
    var [deleteIndex, setDeleteIndex] = useState();

    var getUsers = () => {
        axios.get('/users/')
          .then(res => {
            setUsers(res.data)
            setLoading(false);
            console.log("data", res.data)
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
                {username:users[index].username,
                email:users[index].email,
                admin:users[index].admin,
                status:users[index].status}
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
                setLoading(true)
                getUsers()
                setDeleteIndex(null);
            })
            .catch(err => {
                console.log("Error: " + err)
            })
    }

    return (
        <>
        
            <div className='row'>
                <div className='col-md-4 col-sm-12 nopadding'>
                    <CreateUser setUserAdded={setUserAdded} userAdded={userAdded}/>
                </div>
                <div className='col-md-8 col-sm-12 mt-5'>
                    <h3>Users</h3>
                
                    <div className="table-responsive">
                    {alert && <div className="alert alert-success m-3">{alert}</div>}
                    {deleteIndex &&
                        <div className="alert alert-danger m-3" role="alert">
                            <h5 className="alert-heading">Delete Employee</h5>
                            Are you sure you want to delete this employee?<br/>
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
                        
                            users.map((user, idx) => {
                                return (
                                    <>
                                    <tr key={idx}>
                                        <td>{idx+1}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td><input type="checkbox" checked={user.admin} /></td>
                                        <td><input type="checkbox" checked={user.status} /></td>
                                        <td>
                                            <button className='btn btn-primary btn-margin' onClick={() => editIndex === idx? editUser(null): editUser(idx)}>Edit</button>
                                            <button className='btn btn-danger btn-margin' onClick={() => setDeleteIndex(idx)}>Delete</button>
                                        </td>
                                    </tr>
                                    { editIndex === idx?
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

export default AdminUsers;