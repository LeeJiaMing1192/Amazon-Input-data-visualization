import React, { useState } from 'react';
import './App.css';
import Parser from './Parser';
import OrderParser from './OrderParser';
import Dashboard from './Dashboard';
import OrderDashboard from './OrderDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [data, setData] = useState([]);
  const [orderData, setOrderData] = useState([]);

  return (
    <div className="App">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">CSV/XLSX Visualizer</span>
        </div>
      </nav>

      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Upload Sales Data</h5>
                <Parser onDataParsed={setData} />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Upload Order Data</h5>
                <OrderParser onDataParsed={setOrderData} />
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-12">
            <Dashboard data={data} />
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-12">
            <OrderDashboard data={orderData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
