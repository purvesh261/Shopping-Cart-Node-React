import React, { useState, useEffect, useContext } from 'react';
import { LoginDetails } from '../../App.js';
import '../../App.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function NewMR() {
    const [MRPost, setMRPost] = useState({});
    const [MRItems, setMRItems] = useState([]);
    const [products, setProducts] = useState([{product:'', quantity:'', rate:'', amount:''}]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState('');
    const [productsDropdown, setProductsDropdown] = useState([]);
    const { mrid } = useParams();
    const [editing, setEditing] = useState(false);
    const [oldMR, setOldMR] = useState({});
    const navigate = useNavigate();
    const contextData = useContext(LoginDetails);
    const [MRInward, setMRInward] = useState({
        mr_no: '',
        mr_date: '',
        supplier: '',
        mr_items: [],
        mr_total: 0,
    });
    const user = JSON.parse(localStorage.getItem('user'));

    var getData = async () => {
        try{
            var response = await axios.get('/products/names')
            setProductsDropdown(response.data);
            var mrResponse = await axios.get('/mrinwards/mr-numbers' + MRInward.mr_no);
            setMRItems(mrResponse.data);
        }
        catch(err){
            console.log(err);
        }
    }

    var getEditData = async () => {
        try{
            var response = await axios.get('/mrinwards/' + mrid);
            var mr_date = new Date(response.data.MRInwardDate)
            mr_date = mr_date.toISOString().split('T')[0]
            setMRInward(
                {
                    mr_no: response.data.MRInwardNo,
                    mr_date: mr_date,
                    supplier: response.data.Supplier,
                    mr_items: response.data.MRInwardItems > 0 ? response.data.MRInwardItems: [{product:'', quantity:'', rate:'', amount:''}],
                    mr_total: response.data.MRInwardTotal,
                });
            setOldMR({ ...response.data });
            response.data.MRInwardItems.map(item => {
                item.product = item.product._id;
            });
            setProducts(response.data.MRInwardItems.length > 0 ? response.data.MRInwardItems: [{product:'', quantity:'', rate:'', amount:''}]);
        }
        catch(err)
        {
            console.log(err);
        }
    }

    useEffect(() => {
        if(mrid)
        {
            setEditing(true);
            getEditData(mrid);
        }


        getData(MRPost);
    }, [])

    var editMR = async (MRPost) => {
        try{
            MRPost.oldItems = oldMR.MRInwardItems;
            var response = await axios.put(`/mrinwards/${mrid}/update`, MRPost)
            navigate('/admin/mrinward');
        }
        catch(err)
        {
            console.log(err);
        }
    }

    var postMR = async (MRPost) => {
        try{
            var response = await axios.post('/mrinwards/create', MRPost)
            navigate('/admin/mrinward');
        }
        catch(err)
        {
            console.log(err);
        }
    }


    useEffect(() => {
        if( Object.keys(MRPost).length > 0)
        {
            if(editing)
            {
                editMR(MRPost);
            }
            else
            {
                postMR(MRPost);
            }
        }
    }, [MRPost]);

    

    var onChange = (event) =>
    {
        var newMRInward = {...MRInward};
        var { name, value } = event.target;
        if( name === "mr_date")
        {   
            var date = new Date(value);
            date.setHours(0,0,0,0);
            var today = new Date();
            today.setHours(0,0,0,0);
            if (date > today)
            {
                setAlert("Not a valid date")
                value = ""
                setTimeout(() => setAlert(""), 2000)
            }
            newMRInward[name] = value;
            setMRInward(newMRInward);
            
        }
        else
        {   
            newMRInward[name] = value;
            setMRInward(newMRInward);
        }
    }

    var onProductChange = (event, index) =>
    {
        var { name, value } = event.target;
        var newProducts = [...products];
        newProducts[index][name] = value;
        
        if (name === 'quantity' || name === 'rate')
        {
            newProducts[index].amount = newProducts[index].quantity * newProducts[index].rate;
        } 
        setProducts(newProducts);
        calculateTotal();
    }

    var calculateTotal = () =>
    {
        var total = 0;
        products.forEach(product => {
            total += Number(product.amount);
        });
        setMRInward({...MRInward, mr_total: total});
    }


    var newRow = (event) => {
        event.preventDefault();
        setProducts([...products, {product:'', quantity:'', rate:'', amount:''}]);
    }
    
    var removeRow = (index) => {
        products.splice(index, 1);
        setProducts([...products]); 
    }

    var onSubmitForm = (event) => {
        event.preventDefault();
        var post = true

        if(!editing)
        {
            MRItems.forEach(item => {
                if(item.MRInwardNo === MRInward.mr_no)
                {
                    setAlert('MR Number already exists');
                    setTimeout(() => { setAlert('') }, 2000);
                    post = false;
                    return;
                }
            });
        }

        if(post)
        {
            setMRPost(
            {
                MRInwardNo: MRInward.mr_no,
                MRInwardDate: MRInward.mr_date,
                Supplier: MRInward.supplier,
                MRInwardItems: products,
                MRInwardTotal: MRInward.mr_total
            });
        }


        
    }

  return (
    <div className='mr-form'>
        <h3 className='text-center pt-5 px-5'>Material Receipt (Inward)</h3>
            <form onSubmit={(e) => onSubmitForm(e)}>
                {alert && <div className='alert alert-danger mx-3'>{alert}</div>}
                <div className='form-content'>
                    <div className=''>
                            <label htmlFor='mr-no'>MR No.</label>
                            <input type='text' className='form-control' name="mr_no" value={MRInward.mr_no} onChange={onChange} placeholder='Enter MR No.' required disabled={editing}/>
                    </div>
                    <div className='mt-2'>
                            <label htmlFor='date'>MR Date</label>
                            <input type='date' className='form-control' name="mr_date" value={MRInward.mr_date} onChange={onChange} placeholder='Enter MR Date' required/>
                    </div>
                    <div className='mt-2'>
                            <label htmlFor='mr-no'>Supplier</label>
                            <input type='text' className='form-control' name="supplier" value={MRInward.supplier} onChange={onChange} placeholder='Enter Supplier' required/>
                    </div>

                    <table className='table table-bordered mt-3'>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Rate</th>
                                <th>Amount</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            {
                                products.map((item, idx) => {
                                    return (
                                        <tr key={idx}>
                                            <td>
                                                {/* <input type='text' className='form-control' name='product' value={item.product} onChange={(e) => onProductChange(e,idx)} placeholder='Enter Product' required/> */}
                                                <select name="product" value={item.product} className="form-control" onChange={(e) => onProductChange(e, idx)}>
                                                    <option value={""} key={idx}>Select Product</option>
                                                    {
                                                        !loading && productsDropdown.map((item, idx) => 
                                                        {
                                                            return <option value={item._id} key={idx}>{item.name}</option>
                                                        })

                                                    }
                                                </select>
                                            </td>
                                            <td>
                                                <input type='number' className='form-control' name='quantity' min="0" value={item.quantity} onChange={(e) => onProductChange(e,idx)} placeholder='Enter Quantity' required/>
                                            </td>
                                            <td>
                                                <input type='number' className='form-control' name='rate' min="0" value={item.rate} onChange={(e) => onProductChange(e,idx)} placeholder='Enter Rate' required/>
                                            </td>
                                            <td>
                                                <input type='number' className='form-control' name='amount' min="0" value={item.quantity * item.rate} onChange={(e) => onProductChange(e,idx)} placeholder='Enter Amount' required/>
                                            </td>
                                            <td>
                                                <button className='btn btn-primary' onClick={(e) => newRow(e)}>+</button>
                                            </td>
                                            <td>
                                                <button className='btn btn-danger' onClick={() => removeRow(idx)} disabled={idx === 0}>-</button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                        <div className='form-group mb-2'>
                            <label htmlFor='total'>Total</label>
                            <input type='number' className='form-control' value={MRInward.mr_total} name="mr_total" min="0" onChange={onChange} placeholder='Enter Total' required disabled/>
                        </div>
                        <div className='form-group'>
                            <input type='submit' className='btn btn-primary' value='Submit' />
                        </div>
                </div>
                    
            </form>
    </div>
  )
}

export default NewMR