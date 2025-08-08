import React, { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';

const ReturnDashboard = ({ data }) => {
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
    const totalReturns = data.length;
    const totalReturnedItems = data.reduce((acc, row) => acc + parseInt(row['quantity'] || 0), 0);

    // Chart Data
    const returnsByStatus = data.reduce((acc, row) => {
        const status = row['status'];
        if (status) {
            if (!acc[status]) {
                acc[status] = 0;
            }
            acc[status]++;
        }
        return acc;
    }, {});

    const returnsByStatusData = {
        labels: Object.keys(returnsByStatus),
        datasets: [{
            data: Object.values(returnsByStatus),
            backgroundColor: Object.keys(returnsByStatus).map((_, i) => `hsl(${i * 60}, 70%, 60%)`),
        }]
    };

    const returnsByReason = data.reduce((acc, row) => {
        const reason = row['reason'];
        if (reason) {
            if (!acc[reason]) {
                acc[reason] = 0;
            }
            acc[reason]++;
        }
        return acc;
    }, {});

    const returnsByReasonData = getChartData(Object.keys(returnsByReason), Object.values(returnsByReason), 'Returns by Reason', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 159, 64, 1)');

    const topReturnedProducts = data.reduce((acc, row) => {
        const productName = row['product-name'];
        const quantity = parseInt(row['quantity'] || 0);
        if (!acc[productName]) {
            acc[productName] = 0;
        }
        acc[productName] += quantity;
        return acc;
    }, {});

    const topReturnedProductsData = getChartData(Object.keys(topReturnedProducts), Object.values(topReturnedProducts), 'Top Returned Products by Quantity', 'rgba(75, 192, 192, 0.2)', 'rgba(75, 192, 192, 1)');

    const returnsOverTime = data.reduce((acc, row) => {
        const returnDate = row['return-date'];
        if (returnDate) {
            const date = new Date(returnDate).toLocaleDateString(); // Format date for grouping
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date]++;
        }
        return acc;
    }, {});

    const sortedReturnDates = Object.keys(returnsOverTime).sort((a, b) => new Date(a) - new Date(b));
    const returnsOverTimeData = getChartData(sortedReturnDates, sortedReturnDates.map(date => returnsOverTime[date]), 'Returns Over Time', 'rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 1)');

    return (
      <div className="container-fluid mt-4">
        <h2>Return Dashboard</h2>
        {/* KPIs */}
        <div className="row">
            <div className="col-md-3"><div className="card text-white bg-primary mb-3"><div className="card-header">Total Returns</div><div className="card-body"><h5 className="card-title">{totalReturns}</h5></div></div></div>
            <div className="col-md-3"><div className="card text-white bg-success mb-3"><div className="card-header">Total Returned Items</div><div className="card-body"><h5 className="card-title">{totalReturnedItems}</h5></div></div></div>
        </div>

        {/* Charts */}
        <div className="row">
          <div className="col-md-6"><div className="card"><div className="card-body"><h5 className="card-title">Returns by Status</h5><Pie data={returnsByStatusData} /></div></div></div>
          <div className="col-md-6"><div className="card"><div className="card-body"><h5 className="card-title">Returns by Reason</h5><Bar data={returnsByReasonData} options={{ indexAxis: 'y' }} /></div></div></div>
        </div>

        <div className="row mt-4">
            <div className="col-md-6">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Top Returned Products by Quantity</h5>
                        <Bar data={topReturnedProductsData} options={{ indexAxis: 'y' }} />
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Returns Over Time</h5>
                        <Bar data={returnsOverTimeData} />
                    </div>
                </div>
            </div>
        </div>

        {/* Raw Data Table */}
        <div className="row mt-4">
            <div className="col-md-12">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">Raw Return Data</h5>
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

export default ReturnDashboard;
