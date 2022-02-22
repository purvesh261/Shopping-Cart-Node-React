import React from 'react';
import '../../App.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

function MRInward() {
  return (
      <>
        <div className='row'>
            <div className='col-12'>
                <div className='head'>
                    <h2>MR Inward</h2>
                    <Link to="/admin/mrinward/new"><button className='btn btn-primary btn-create'>Create MR</button></Link>
                </div>
            </div>
        </div>
      </>

  )
}

export default MRInward