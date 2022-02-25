import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

export default function Home(props) {
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Sort By");
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/products/')
      .then(res => {
        setProducts(res.data);
        setData(res.data);
        setCategories([ ...new Set(res.data.map((prods) => prods.category))]);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
      }
    );
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [data]);


  var filterCategory = (category) => {
    console.log(category);
    setFilter(category);
    if(category === "All")
    {
      setData(products);
    }
    else
    {
      setData(products.filter((product) => product.category === category));
    }

  }

  var sortProducts = (sort) => {
    setSort(sort);
    if(sort ===  "Price: Low to High")
    {
      setData([ ...data ].sort((a, b) => (a.price > b.price) ? 1 : -1));
    }
    else if(sort === "Price: High to Low")
    {
      setData([ ...data ].sort((a, b) => (a.price < b.price) ? 1 : -1));
    }
    else if(sort === "Newest")
    {
      setData([ ...data ].sort((a, b) => (a.dateAdded > b.dateAdded) ? 1 : -1));
    }
    else if(sort === "Oldest")
    {
      setData([ ...data ].sort((a, b) => (a.dateAdded < b.dateAdded) ? 1 : -1));
    }
  }

  var search = (search) => {
    setSearchQuery(search);
    setFilter("All");
    setSort("Sort By");
    if(search === "")
    {
      setData([ ...products ]);
    }
    else
    {
      setData([ ...products ].filter((product) => product.name.toLowerCase().includes(search.toLowerCase())));
    }
  }

  return (
    <>
    <div className='container-fluid'>
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-6">
            <form>
              <div className="input-group search justify-content-center">
                <div className="form-outline w-75">
                  <input type="search" className="form-control p-2" placeholder='Search products' value={searchQuery} onChange={(e) => search(e.target.value)}/>
                </div>
                <button type="submit " className="rounded submit p-2 px-4 color-primary login-btn">
                  Search
                </button>
              </div>
            </form>
        </div>
        <div className="col-md-3 options">
          <select value={sort} onChange={(e) => sortProducts(e.target.value)}>
            <option value="0">Sort by</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
            <option>Oldest</option>
          </select>
          <select value={filter} onChange={(e) => filterCategory(e.target.value)}>
            <option value={"All"}>All</option>
            {categories.map((category, index) => {
              return (
                <option key={index} value={category}>{category}</option>
              )
            })}
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
          {data.length > 0 ? data.map((product, index) => {
              return (
                <ProductCard product={product} index={index} />
              )})
              :
              <div className="col-md-12 text-center p-5 text-secondary">
                <h3>No products found</h3>
              </div>
          }
        </div> 
      </div>
    }
  </>
  )
}
