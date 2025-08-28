
import React, { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';

const OrderReportDashboard = ({ data }) => {
  const [showRawData, setShowRawData] = useState(false); // State for toggling raw data visibility

  const getChartData = (labels, chartData, label, backgroundColor, borderColor) => {
    const datasets = Array.isArray(label) ? 
      label.map((l, i) => ({
        label: l,
        data: chartData[i],
        backgroundColor: Array.isArray(backgroundColor) ? backgroundColor[i] : backgroundColor,
        borderColor: Array.isArray(borderColor) ? borderColor[i] : borderColor,
        borderWidth: 1,
      })) :
      [{
        label,
        data: chartData,
        backgroundColor: backgroundColor || 'rgba(75,192,192,0.2)',
        borderColor: borderColor || 'rgba(75,192,192,1)',
        borderWidth: 1,
      }];

    return {
      labels,
      datasets,
    };
  };

  const renderDashboard = () => {
    if (!data || data.length === 0) {
      return null;
    }

    // KPI Calculations
    const totalOrders = data.length;
    const totalItems = data.reduce((acc, row) => acc + parseInt(row['number_of_items'] || 0), 0);
    const totalRevenue = data.reduce((acc, row) => acc + parseFloat(row['item_price'] || 0), 0).toFixed(2);
    const shippedOrders = data.filter(row => row['order_status'] === 'Shipped').length;
    const pendingOrders = data.filter(row => row['order_status'] !== 'Shipped' && row['order_status'] !== 'Canceled').length;
    const canceledOrders = data.filter(row => row['order_status'] === 'Canceled').length;

    // Chart Data
    const ordersByStatusData = {
        labels: ['Shipped', 'Pending', 'Canceled'],
        datasets: [{
            data: [shippedOrders, pendingOrders, canceledOrders],
            backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
        }]
    };

    const topProductsByQuantity = data.reduce((acc, row) => {
        const productName = row['product_name'];
        const quantity = parseInt(row['quantity'] || 0);
        if (!acc[productName]) {
            acc[productName] = 0;
        }
        acc[productName] += quantity;
        return acc;
    }, {});

    const topProductsData = getChartData(Object.keys(topProductsByQuantity), Object.values(topProductsByQuantity), 'Top Products by Quantity', 'rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 1)');

    const totalRevenueByProduct = data.reduce((acc, row) => {
        const productName = row['product_name'];
        const itemPrice = parseFloat(row['item_price'] || 0);
        if (!acc[productName]) {
            acc[productName] = 0;
        }
        acc[productName] += itemPrice;
        return acc;
    }, {});

    const revenueByProductData = getChartData(Object.keys(totalRevenueByProduct), Object.values(totalRevenueByProduct), 'Total Revenue by Product', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 99, 132, 1)');

    const ordersByFulfillment = data.reduce((acc, row) => {
        const fulfillment = row['fulfillment_channel'];
        if(fulfillment) {
            if (!acc[fulfillment]) {
                acc[fulfillment] = 0;
            }
            acc[fulfillment]++;
        }
        return acc;
    }, {});

    const ordersByFulfillmentData = {
        labels: Object.keys(ordersByFulfillment),
        datasets: [{
            data: Object.values(ordersByFulfillment),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        }]
    };

    const ordersBySalesChannel = data.reduce((acc, row) => {
        const channel = row['sales_channel'];
        if(channel) {
            if (!acc[channel]) {
                acc[channel] = 0;
            }
            acc[channel]++;
        }
        return acc;
    }, {});

    const ordersBySalesChannelData = {
        labels: Object.keys(ordersBySalesChannel),
        datasets: [{
            data: Object.values(ordersBySalesChannel),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        }]
    };


    return (
      <div className="container-fluid mt-4">
        <h2>Order Report Dashboard</h2>
        {/* KPIs */}
        <div className="row">
            <div className="col-md-3"><div className="card text-white bg-primary mb-3"><div className="card-header">Total Orders</div><div className="card-body"><h5 className="card-title">{totalOrders}</h5></div></div></div>
            <div className="col-md-3"><div className="card text-white bg-success mb-3"><div className="card-header">Total Items</div><div className="card-body"><h5 className="card-title">{totalItems}</h5></div></div></div>
            <div className="col-md-3"><div className="card text-white bg-info mb-3"><div className="card-header">Total Revenue</div><div className="card-body"><h5 className="card-title">${totalRevenue}</h5></div></div></div>
        </div>

        {/* Charts */}
        <div className="row">
          <div className="col-md-6"><div className="card"><div className="card-body"><h5 className="card-title">Orders by Status</h5><Pie data={ordersByStatusData} /></div></div></div>
          <div className="col-md-6"><div className="card"><div className="card-body"><h5 className="card-title">Top Products by Quantity</h5><Bar data={topProductsData} options={{ indexAxis: 'y' }} /></div></div></div>
        </div>

        <div className="row mt-4">
            <div className="col-md-6">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Total Revenue by Product</h5>
                        <Bar data={revenueByProductData} options={{ indexAxis: 'y' }} />
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Orders by Fulfillment Channel</h5>
                        <Pie data={ordersByFulfillmentData} />
                    </div>
                </div>
            </div>
        </div>

        <div className="row mt-4">
            <div className="col-md-6">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Orders by Sales Channel</h5>
                        <Pie data={ordersBySalesChannelData} />
                    </div>
                </div>
            </div>
        </div>

        {/* Raw Data Table */}
        <div className="row mt-4">
            <div className="col-md-12">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">Raw Order Report Data</h5>
                        <button 
                            className="btn btn-sm btn-primary" 
                            onClick={() => setShowRawData(!showRawData)}
                        >
                            {showRawData ? 'Collapse' : 'Expand'}
                        </button>
                    </div>
                    {showRawData && (
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>{Object.keys(data[0]).map((header, index) => <th key={index}>{header}</th>)}</tr>
                                    </thead>
                                    <tbody>
                                        {data.map((row, rowIndex) => (
                                            <tr key={rowIndex}>{Object.values(row).map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

      </div>
    );
  };

  return renderDashboard();
};

export default OrderReportDashboard;
