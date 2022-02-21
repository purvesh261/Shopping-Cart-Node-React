import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home(props) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    axios.get('/users/')
      .then(res => {
        setData(res.data);
        console.log("data", res.data)
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <div>Products </div>
      <div className="container">
  <div className="row">
    <div className="col-md-3 col-xs-12">
      <div className="card" style={{width:"18rem"}}>
        <img src={""} alt="Card image cap" />
        <h1> Product 1</h1>
        <div className="card-text">
          Price: 600 <br/>
          Description
        </div>
      </div>
    </div>
    <div className="col-md-3 col-xs-12">
      <div className="card" style={{width:"18rem"}}>
        <img src={""} alt="Card image cap" />
        <h1> Product 2</h1>
        <div className="card-text">
          Price: 1300 <br/>
          Description
        </div>
      </div>
    </div>
    <div className="col-md-3 col-xs-12" >
      <div className="card" style={{width:"18rem"}}>
        <img src={""} alt="Card image cap" />
        <h1> Product 3</h1>
        <div className="card-text">
          Price: 1300 <br/>
          Description
        </div>
      </div>
    </div>
  </div>
</div>
      
      
    </>
    
  )
}
