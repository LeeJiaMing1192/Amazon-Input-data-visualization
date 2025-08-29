import React, { useState } from 'react';
import './App.css';
import Dashboard from './Dashboard';
import OrderDashboard from './OrderDashboard';
import BrandPerformanceDashboard from './BrandPerformanceDashboard';
import ReturnDashboard from './ReturnDashboard';
import OrderReportDashboard from './OrderReportDashboard';
import SalesAndTrafficDashboard from './SalesAndTrafficDashboard';
import FileUpload from './FileUpload';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tabs, Tab, Container, Row, Col } from 'react-bootstrap';
import { GraphUp, BoxSeam, Trophy, ArrowReturnLeft, FileEarmarkText, BarChartSteps } from 'react-bootstrap-icons';

function App() {
  const [data, setData] = useState({
    sales: [],
    order: [],
    brand: [],
    return: [],
    order_report: [],
    sales_and_traffic: [],
  });
  const [key, setKey] = useState('sales');

  const handleDataParsed = (dataType, parsedData) => {
    setData((prevData) => ({
      ...prevData,
      [dataType]: parsedData,
    }));

    const tabKeys = {
      sales: 'sales',
      order: 'orders',
      brand: 'brand',
      return: 'returns',
      order_report: 'order_report',
      sales_and_traffic: 'sales_and_traffic',
    };

    setKey(tabKeys[dataType]);
  };

  return (
    <div className="App">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">CSV/XLSX Visualizer</span>
        </div>
      </nav>

      <Container className="mt-4">
        <FileUpload onDataParsed={handleDataParsed} />

        <Row className="mt-4">
          <Col md={12}>
            <Tabs
              id="dashboard-tabs"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-3"
            >
              <Tab eventKey="sales" title={<><GraphUp className="me-2" /> Sales Dashboard</>}>
                <Dashboard data={data.sales} />
              </Tab>
              <Tab eventKey="orders" title={<><BoxSeam className="me-2" /> Order Dashboard</>}>
                <OrderDashboard data={data.order} />
              </Tab>
              <Tab eventKey="brand" title={<><Trophy className="me-2" /> Brand Performance Dashboard</>}>
                <BrandPerformanceDashboard data={data.brand} />
              </Tab>
              <Tab eventKey="returns" title={<><ArrowReturnLeft className="me-2" /> Return Dashboard</>}>
                <ReturnDashboard data={data.return} />
              </Tab>
              <Tab eventKey="order_report" title={<><FileEarmarkText className="me-2" /> Order Report Dashboard</>}>
                <OrderReportDashboard data={data.order_report} />
              </Tab>
              <Tab eventKey="sales_and_traffic" title={<><BarChartSteps className="me-2" /> Sales and Traffic Dashboard</>}>
                <SalesAndTrafficDashboard data={data.sales_and_traffic} />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;