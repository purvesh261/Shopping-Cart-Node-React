import React, { useState } from 'react';
import '../../App.css';

function NewMR() {
    const [products, setProducts] = useState([{product:'', quantity:'', rate:'', amount:''}]);

    var newRow = (event) => {
        event.preventDefault();
        console.log(products);
        setProducts([...products, {product:'', quantity:'', rate:'', amount:''}]);
    }
    
    var removeRow = (index) => {
        products.splice(index, 1);
        setProducts([...products]); 
    }

  return (
    <div className='mr-form'>
        <h3 className='text-center pt-5 px-5'>Material Receipt (Inward)</h3>
            <form>
                <div className='form-content'>
                    <div className=''>
                            <label htmlFor='mr-no'>MR No.</label>
                            <input type='text' className='form-control' placeholder='Enter MR No.' />
                    </div>
                    <div className='mt-2'>
                            <label htmlFor='date'>MR Date</label>
                            <input type='date' className='form-control' placeholder='Enter MR Date' />
                    </div>
                    <div className='mt-2'>
                            <label htmlFor='mr-no'>Supplier</label>
                            <input type='text' className='form-control' id='Supplier' placeholder='Enter Supplier' />
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
                                                <input type='text' className='form-control' placeholder='Enter Product' />
                                            </td>
                                            <td>
                                                <input type='number' className='form-control' placeholder='Enter Quantity' />
                                            </td>
                                            <td>
                                                <input type='number' className='form-control' placeholder='Enter Rate' />
                                            </td>
                                            <td>
                                                <input type='number' className='form-control' placeholder='Enter Amount' />
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
                </div>
                    
            </form>
    </div>
  )
}

export default NewMR