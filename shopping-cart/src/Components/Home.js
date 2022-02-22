import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

export default function Home(props) {
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/users/')
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        console.log(err);
      });
    
    axios.get('/products/')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
      }
    );
  }, []);

  return (
    <>
    <div className='container-fluid'>
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-6">
            <form>
              <div className="input-group search justify-content-center">
                <div className="form-outline w-75">
                  <input type="search" className="form-control p-2" placeholder='Search products'/>
                </div>
                <button type="submit " className="rounded submit p-2 px-4 color-primary login-btn">
                  Search
                </button>
              </div>
            </form>
        </div>
        <div className="col-md-3 options">
          <select>
            <option value="0">Sort by</option>
            <option value="1">Price: Low to High</option>
            <option value="2">Price: High to Low</option>
            <option value="3">Newest</option>
            <option value="4">Oldest</option>
          </select>
          <select>
            <option>Category</option>
            <option>Category 1</option>
            <option>Category 2</option>
            <option>Category 3</option>
          </select>
        </div>
      </div>
      </div>
      {loading ? 
      <div className="spinner-border text-primary loading" role="status">
        <span className="sr-only"></span>
      </div>
      :
      <div className="container">
        <div className="row g-3">
          {products.map((product, index) => {
              return (
                <ProductCard product={product} index={index} />
              )})
          }
        </div> 
      </div>
    }
  </>
  )
}
