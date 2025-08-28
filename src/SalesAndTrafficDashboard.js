
import React, { useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';

const SalesAndTrafficDashboard = ({ data }) => {
  const [showRawData, setShowRawData] = useState(false);

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
    const totalImpressions = data.reduce((acc, row) => acc + parseInt(row['sessions_total'] || 0), 0);
    const totalClicks = data.reduce((acc, row) => acc + parseInt(row['sessions_total'] || 0), 0); // No direct mapping for clicks, using sessions_total as a placeholder
    const totalSales = data.reduce((acc, row) => acc + parseFloat(row['ordered_product_sales'] || 0), 0).toFixed(2);
    const totalOrders = data.reduce((acc, row) => acc + parseInt(row['total_order_items'] || 0), 0);
    const conversionRate = (data.reduce((acc, row) => acc + parseFloat(row['unit_session_pct'] || 0), 0) / data.length).toFixed(2);
    const avgSessionPct = (data.reduce((acc, row) => acc + parseFloat(row['session_pct_total'] || 0), 0) / data.length).toFixed(2);
    const avgPageViewsPct = (data.reduce((acc, row) => acc + parseFloat(row['page_views_pct_total'] || 0), 0) / data.length).toFixed(2);
    const totalB2BUnitsOrdered = data.reduce((acc, row) => acc + parseInt(row['units_ordered_b2b'] || 0), 0);

    // Chart Data
    const salesByAsin = data.reduce((acc, row) => {
        const asin = row['child_asin'];
        const sales = parseFloat(row['ordered_product_sales'] || 0);
        if (!acc[asin]) {
            acc[asin] = 0;
        }
        acc[asin] += sales;
        return acc;
    }, {});

    const salesByAsinData = getChartData(Object.keys(salesByAsin), Object.values(salesByAsin), 'Sales by ASIN', 'rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 1)');

    const impressionsOverTimeData = {
        labels: data.map(row => row['date']),
        datasets: [
            {
                label: 'Impressions',
                data: data.map(row => parseInt(row['sessions_total'] || 0)),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
            }
        ]
    };

    const sessionsByTypeData = {
        labels: ['Mobile App', 'Browser', 'Mobile App B2B', 'Browser B2B'],
        datasets: [{
            data: [
                data.reduce((acc, row) => acc + parseInt(row['sessions_mobile_app'] || 0), 0),
                data.reduce((acc, row) => acc + parseInt(row['sessions_browser'] || 0), 0),
                data.reduce((acc, row) => acc + parseInt(row['sessions_mobile_app_b2b'] || 0), 0),
                data.reduce((acc, row) => acc + parseInt(row['sessions_browser_b2b'] || 0), 0),
            ],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        }]
    };

    const pageViewsByTypeData = {
        labels: ['Mobile App', 'Browser', 'Mobile App B2B', 'Browser B2B'],
        datasets: [{
            data: [
                data.reduce((acc, row) => acc + parseInt(row['page_views_mobile_app'] || 0), 0),
                data.reduce((acc, row) => acc + parseInt(row['page_views_browser'] || 0), 0),
                data.reduce((acc, row) => acc + parseInt(row['page_views_mobile_app_b2b'] || 0), 0),
                data.reduce((acc, row) => acc + parseInt(row['page_views_browser_b2b'] || 0), 0),
            ],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        }]
    };

    const unitsOrderedByTypeData = {
        labels: ['B2C', 'B2B'],
        datasets: [{
            data: [
                data.reduce((acc, row) => acc + parseInt(row['units_ordered'] || 0), 0),
                data.reduce((acc, row) => acc + parseInt(row['units_ordered_b2b'] || 0), 0),
            ],
            backgroundColor: ['#FF6384', '#36A2EB'],
        }]
    };

    const salesByTypeData = {
        labels: ['B2C', 'B2B'],
        datasets: [{
            data: [
                data.reduce((acc, row) => acc + parseFloat(row['ordered_product_sales'] || 0), 0),
                data.reduce((acc, row) => acc + parseFloat(row['ordered_product_sales_b2b'] || 0), 0),
            ],
            backgroundColor: ['#FF6384', '#36A2EB'],
        }]
    };

    return (
      <div className="container-fluid mt-4">
        <h2>Sales and Traffic Dashboard</h2>
        {/* KPIs */}
        <div className="row">
            <div className="col-md-3"><div className="card text-white bg-primary mb-3"><div className="card-header">Total Impressions</div><div className="card-body"><h5 className="card-title">{totalImpressions}</h5></div></div></div>
            <div className="col-md-3"><div className="card text-white bg-success mb-3"><div className="card-header">Total Clicks (Sessions)</div><div className="card-body"><h5 className="card-title">{totalClicks}</h5></div></div></div>
            <div className="col-md-3"><div className="card text-white bg-info mb-3"><div className="card-header">Total Sales</div><div className="card-body"><h5 className="card-title">${totalSales}</h5></div></div></div>
            <div className="col-md-3"><div className="card text-white bg-warning mb-3"><div className="card-header">Conversion Rate</div><div className="card-body"><h5 className="card-title">{conversionRate}%</h5></div></div></div>
            <div className="col-md-3"><div className="card text-white bg-danger mb-3"><div className="card-header">Avg. Session %</div><div className="card-body"><h5 className="card-title">{avgSessionPct}%</h5></div></div></div>
            <div className="col-md-3"><div className="card text-dark bg-light mb-3"><div className="card-header">Avg. Page Views %</div><div className="card-body"><h5 className="card-title">{avgPageViewsPct}%</h5></div></div></div>
            <div className="col-md-3"><div className="card text-white bg-dark mb-3"><div className="card-header">Total B2B Units Ordered</div><div className="card-body"><h5 className="card-title">{totalB2BUnitsOrdered}</h5></div></div></div>
        </div>

        {/* Charts */}
        <div className="row">
          <div className="col-md-6"><div className="card"><div className="card-body"><h5 className="card-title">Sales by ASIN</h5><Bar data={salesByAsinData} options={{ indexAxis: 'y' }} /></div></div></div>
          <div className="col-md-6"><div className="card"><div className="card-body"><h5 className="card-title">Impressions Over Time</h5><Line data={impressionsOverTimeData} /></div></div></div>
        </div>

        <div className="row mt-4">
          <div className="col-md-6"><div className="card"><div className="card-body"><h5 className="card-title">Sessions by Type</h5><Pie data={sessionsByTypeData} /></div></div></div>
          <div className="col-md-6"><div className="card"><div className="card-body"><h5 className="card-title">Page Views by Type</h5><Pie data={pageViewsByTypeData} /></div></div></div>
        </div>

        <div className="row mt-4">
          <div className="col-md-6"><div className="card"><div className="card-body"><h5 className="card-title">Units Ordered by Type</h5><Pie data={unitsOrderedByTypeData} /></div></div></div>
          <div className="col-md-6"><div className="card"><div className="card-body"><h5 className="card-title">Sales by Type</h5><Pie data={salesByTypeData} /></div></div></div>
        </div>

        {/* Raw Data Table */}
        <div className="row mt-4">
            <div className="col-md-12">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">Raw Sales and Traffic Data</h5>
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

export default SalesAndTrafficDashboard;
