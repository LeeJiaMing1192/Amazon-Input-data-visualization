import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = ({ data }) => {
  const getChartData = (labels, data, label, backgroundColor, borderColor) => {
    return {
      labels,
      datasets: [
        {
          label,
          data,
          backgroundColor: backgroundColor || 'rgba(75,192,192,0.2)',
          borderColor: borderColor || 'rgba(75,192,192,1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const renderDashboard = () => {
    if (!data || data.length === 0) {
      return null;
    }

    // Data Extraction and KPI Calculations
    const dates = data.map(row => row['Date']);
    const titles = data.map(row => row['Title']);
    const parentAsins = [...new Set(data.map(row => row['(Parent) ASIN']))];

    const parseCurrency = (value) => {
        if (typeof value === 'string') {
            return parseFloat(value.replace(/[^0-9.-]+/g,"")) || 0;
        }
        return value || 0;
    }

    const totalSales = data.reduce((acc, row) => acc + parseCurrency(row['Ordered Product Sales']), 0).toFixed(2);
    const totalSalesB2B = data.reduce((acc, row) => acc + parseCurrency(row['Ordered Product Sales - B2B']), 0).toFixed(2);
    const totalUnitsOrdered = data.reduce((acc, row) => acc + parseInt(row['Units Ordered'] || 0), 0);
    const totalUnitsOrderedB2B = data.reduce((acc, row) => acc + parseInt(row['Units Ordered - B2B'] || 0), 0);
    const totalSessions = data.reduce((acc, row) => acc + parseInt(row['Sessions - Total'] || 0), 0);
    const totalSessionsB2B = data.reduce((acc, row) => acc + parseInt(row['Sessions - Total - B2B'] || 0), 0);
    const avgBuyBox = (data.reduce((acc, row) => acc + parseFloat(row['Featured Offer (Buy Box) Percentage'] || 0), 0) / data.length).toFixed(2);

    // Chart Data
    const salesByMonth = data.reduce((acc, row) => {
        const date = new Date(row['Date']);
        const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        const sales = parseCurrency(row['Ordered Product Sales']);
        if (!acc[month]) {
            acc[month] = 0;
        }
        acc[month] += sales;
        return acc;
    }, {});

    const salesOverTimeData = getChartData(Object.keys(salesByMonth), Object.values(salesByMonth), 'Sales Over Time');
    const sessionsByTypeData = {
      labels: ['Mobile App', 'Browser', 'Mobile App - B2B', 'Browser - B2B'],
      datasets: [{
        label: 'Sessions by Type',
        data: [
          data.reduce((acc, row) => acc + parseInt(row['Sessions - Mobile App'] || 0), 0),
          data.reduce((acc, row) => acc + parseInt(row['Sessions - Browser'] || 0), 0),
          data.reduce((acc, row) => acc + parseInt(row['Sessions - Mobile APP - B2B'] || 0), 0),
          data.reduce((acc, row) => acc + parseInt(row['Sessions - Browser - B2B'] || 0), 0),
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      }],
    };
    const pageViewsByTypeData = {
        labels: ['Mobile App', 'Browser', 'Mobile App - B2B', 'Browser - B2B'],
        datasets: [{
          label: 'Page Views by Type',
          data: [
            data.reduce((acc, row) => acc + parseInt(row['Page Views - Mobile App'] || 0), 0),
            data.reduce((acc, row) => acc + parseInt(row['Page Views - Browser'] || 0), 0),
            data.reduce((acc, row) => acc + parseInt(row['Page Views - Mobile APP - B2B'] || 0), 0),
            data.reduce((acc, row) => acc + parseInt(row['Page Views - Browser - B2B'] || 0), 0),
          ],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        }],
      };
    const topProductsByUnitsData = getChartData(titles, data.map(row => parseInt(row['Units Ordered'] || 0)), 'Top Performing Products by Units Ordered', 'rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 1)');
    const conversionRateBySessionTypeData = getChartData(
        ['Mobile App', 'Browser', 'Total'], 
        [
            (data.reduce((acc, row) => acc + parseInt(row['Units Ordered'] || 0), 0) / data.reduce((acc, row) => acc + parseInt(row['Sessions - Mobile App'] || 0), 0) * 100).toFixed(2),
            (data.reduce((acc, row) => acc + parseInt(row['Units Ordered'] || 0), 0) / data.reduce((acc, row) => acc + parseInt(row['Sessions - Browser'] || 0), 0) * 100).toFixed(2),
            (data.reduce((acc, row) => acc + parseInt(row['Units Ordered'] || 0), 0) / data.reduce((acc, row) => acc + parseInt(row['Sessions - Total'] || 0), 0) * 100).toFixed(2),
        ], 
        'Conversion Rate by Session Type (%)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 159, 64, 1)');

    return (
      <div className="container-fluid mt-4">
        {/* KPIs */}
        <div className="row">
            <div className="col-md-3"><div className="card text-white bg-primary mb-3"><div className="card-header">Total Sales</div><div className="card-body"><h5 className="card-title">${totalSales}</h5></div></div></div>
            <div className="col-md-3"><div className="card text-white bg-secondary mb-3"><div className="card-header">Total Sales (B2B)</div><div className="card-body"><h5 className="card-title">${totalSalesB2B}</h5></div></div></div>
            <div className="col-md-3"><div className="card text-white bg-success mb-3"><div className="card-header">Total Units Ordered</div><div className="card-body"><h5 className="card-title">{totalUnitsOrdered}</h5></div></div></div>
            <div className="col-md-3"><div className="card text-white bg-dark mb-3"><div className="card-header">Total Units Ordered (B2B)</div><div className="card-body"><h5 className="card-title">{totalUnitsOrderedB2B}</h5></div></div></div>
            <div className="col-md-3"><div className="card text-white bg-info mb-3"><div className="card-header">Total Sessions</div><div className="card-body"><h5 className="card-title">{totalSessions}</h5></div></div></div>
            <div className="col-md-3"><div className="card text-white bg-warning mb-3"><div className="card-header">Total Sessions (B2B)</div><div className="card-body"><h5 className="card-title">{totalSessionsB2B}</h5></div></div></div>
            <div className="col-md-3"><div className="card text-white bg-danger mb-3"><div className="card-header">Avg. Buy Box %</div><div className="card-body"><h5 className="card-title">{avgBuyBox}%</h5></div></div></div>
            <div className="col-md-3"><div className="card text-white bg-light text-dark mb-3"><div className="card-header">Parent ASINs</div><div className="card-body"><h5 className="card-title">{parentAsins.length}</h5></div></div></div>
        </div>

        {/* Charts */}
        <div className="row">
          <div className="col-md-8"><div className="card"><div className="card-body"><h5 className="card-title">Sales Over Time</h5><Line data={salesOverTimeData} /></div></div></div>
          <div className="col-md-4"><div className="card"><div className="card-body"><h5 className="card-title">Sessions by Type</h5><Doughnut data={sessionsByTypeData} /></div></div></div>
        </div>

        <div className="row mt-4">
            <div className="col-md-8"><div className="card"><div className="card-body"><h5 className="card-title">Top Performing Products (Units Ordered)</h5><Bar data={topProductsByUnitsData} options={{ indexAxis: 'y' }} /></div></div></div>
            <div className="col-md-4"><div className="card"><div className="card-body"><h5 className="card-title">Page Views by Type</h5><Doughnut data={pageViewsByTypeData} /></div></div></div>
        </div>

        <div className="row mt-4">
            <div className="col-md-12"><div className="card"><div className="card-body"><h5 className="card-title">Conversion Rate by Session Type</h5><Bar data={conversionRateBySessionTypeData} /></div></div></div>
        </div>

        {/* Raw Data Table */}
        <div className="row mt-4">
            <div className="col-md-12">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Raw Data</h5>
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
                </div>
            </div>
        </div>

      </div>
    );
  };

  return renderDashboard();
};

export default Dashboard;
