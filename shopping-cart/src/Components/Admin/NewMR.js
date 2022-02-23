import React, { useState, useEffect } from 'react';
import '../../App.css';
import axios from 'axios';

function NewMR() {
    const [MRInward, setMRInward] = useState({
        mr_no: '',
        mr_date: '',
        supplier: '',
        mr_items: [],
        mr_total: 0,
    });

    const [MRPost, setMRPost] = useState({});

    const [products, setProducts] = useState([{product:'', quantity:'', rate:'', amount:''}]);

    useEffect(() => {
        console.log(MRPost);
        axios.post('/mrinwards/create/', MRPost)
            .then(res => {
                console.log(res, "response");
            })
            .catch(err => {
                console.log(err);
            }
        );
    }, [MRPost]);

    var onChange = (event) =>
    {
        var newMRInward = {...MRInward};
        newMRInward[event.target.name] = event.target.value;
        setMRInward(newMRInward);
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
        console.log(total, "total");
        setMRInward({...MRInward, mr_total: total});
    }


    var newRow = (event) => {
        event.preventDefault();
        console.log(products);
        setProducts([...products, {product:'', quantity:'', rate:'', amount:''}]);
    }
    
    var removeRow = (index) => {
        products.splice(index, 1);
        setProducts([...products]); 
    }

    var onSubmitForm = (event) => {
        event.preventDefault();
        
        setMRPost(
            {
                MRInwardNo: MRInward.mr_no,
                MRInwardDate: MRInward.mr_date,
                Supplier: MRInward.supplier,
                MRInwardItems: products,
                MRInwardTotal: MRInward.mr_total
            });
    }

  return (
    <div className='mr-form'>
        <h3 className='text-center pt-5 px-5'>Material Receipt (Inward)</h3>
            <form onSubmit={onSubmitForm}>
                <div className='form-content'>
                    <div className=''>
                            <label htmlFor='mr-no'>MR No.</label>
                            <input type='text' className='form-control' name="mr_no" value={MRInward.mr_no} onChange={onChange} placeholder='Enter MR No.' required/>
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
                                                <input type='text' className='form-control' name='product' value={item.product} onChange={(e) => onProductChange(e,idx)} placeholder='Enter Product' required/>
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
                                                <button className='btn btn-danger' onClick={(e) => removeRow(e, idx)} disabled={idx === 0}>-</button>
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