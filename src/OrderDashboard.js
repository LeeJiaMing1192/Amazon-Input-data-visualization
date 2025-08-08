import React, { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';

const OrderDashboard = ({ data }) => {
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
    const totalItems = data.reduce((acc, row) => acc + parseInt(row['number-of-items'] || 0), 0);
    const totalRevenue = data.reduce((acc, row) => acc + parseFloat(row['item-price'] || 0), 0).toFixed(2);
    const shippedOrders = data.filter(row => row['order-status'] === 'Shipped').length;
    const pendingOrders = data.filter(row => row['order-status'] !== 'Shipped' && row['order-status'] !== 'Canceled').length;
    const canceledOrders = data.filter(row => row['order-status'] === 'Canceled').length;

    // Chart Data
    const ordersByStatusData = {
        labels: ['Shipped', 'Pending', 'Canceled'],
        datasets: [{
            data: [shippedOrders, pendingOrders, canceledOrders],
            backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
        }]
    };

    const topProductsByQuantity = data.reduce((acc, row) => {
        const productName = row['product-name'];
        const quantity = parseInt(row['quantity'] || 0);
        if (!acc[productName]) {
            acc[productName] = 0;
        }
        acc[productName] += quantity;
        return acc;
    }, {});

    const topProductsData = getChartData(Object.keys(topProductsByQuantity), Object.values(topProductsByQuantity), 'Top Products by Quantity', 'rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 1)');

    const totalRevenueByProduct = data.reduce((acc, row) => {
        const productName = row['product-name'];
        const itemPrice = parseFloat(row['item-price'] || 0);
        if (!acc[productName]) {
            acc[productName] = 0;
        }
        acc[productName] += itemPrice;
        return acc;
    }, {});

    const revenueByProductData = getChartData(Object.keys(totalRevenueByProduct), Object.values(totalRevenueByProduct), 'Total Revenue by Product', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 99, 132, 1)');

    const ordersByDate = data.reduce((acc, row) => {
        const orderDate = row['purchase-date']; // Assuming 'purchase-date' field exists
        if (orderDate) {
            if (!acc[orderDate]) {
                acc[orderDate] = 0;
            }
            acc[orderDate]++;
        }
        return acc;
    }, {});

    const sortedDates = Object.keys(ordersByDate).sort();
    const ordersOverTimeData = getChartData(sortedDates, sortedDates.map(date => ordersByDate[date]), 'Orders Over Time', 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 1)');

    const itemsPerOrder = data.reduce((acc, row) => {
        const numItems = parseInt(row['quantity'] || 0);
        if (numItems > 0) {
            if (!acc[numItems]) {
                acc[numItems] = 0;
            }
            acc[numItems]++;
        }
        return acc;
    }, {});

    const sortedItemsCounts = Object.keys(itemsPerOrder).sort((a, b) => a - b);
    const itemsPerOrderData = getChartData(sortedItemsCounts, sortedItemsCounts.map(count => itemsPerOrder[count]), 'Number of Items per Order', 'rgba(75, 192, 192, 0.2)', 'rgba(75, 192, 192, 1)');

    const ordersByPaymentMethod = data.reduce((acc, row) => {
        const paymentMethod = row['payment-method-details']; // Assuming 'payment-method-details' field exists
        if (paymentMethod) {
            if (!acc[paymentMethod]) {
                acc[paymentMethod] = 0;
            }
            acc[paymentMethod]++;
        }
        return acc;
    }, {});

    const paymentMethodLabels = Object.keys(ordersByPaymentMethod);
    const paymentMethodData = {
        labels: paymentMethodLabels,
        datasets: [{
            data: Object.values(ordersByPaymentMethod),
            backgroundColor: paymentMethodLabels.map((_, i) => `hsl(${i * 60}, 70%, 60%)`), // Dynamic colors
        }]
    };

    return (
      <div className="container-fluid mt-4">
        <h2>Order Dashboard</h2>
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
                        <h5 className="card-title">Orders Over Time</h5>
                        <Bar data={ordersOverTimeData} />
                    </div>
                </div>
            </div>
        </div>

        <div className="row mt-4">
            <div className="col-md-6">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Distribution of Items per Order</h5>
                        <Bar data={itemsPerOrderData} />
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Orders by Payment Method</h5>
                        <Pie data={paymentMethodData} />
                    </div>
                </div>
            </div>
        </div>

        {/* Raw Data Table */}
        <div className="row mt-4">
            <div className="col-md-12">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">Raw Order Data</h5>
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

export default OrderDashboard;
