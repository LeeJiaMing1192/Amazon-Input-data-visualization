import React, { useState } from 'react';
import './App.css';
import Parser from './Parser';
import OrderParser from './OrderParser';
import BrandPerformanceParser from './BrandPerformanceParser';
import ReturnParser from './ReturnParser';
import Dashboard from './Dashboard';
import OrderDashboard from './OrderDashboard';
import BrandPerformanceDashboard from './BrandPerformanceDashboard';
import ReturnDashboard from './ReturnDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tabs, Tab, Container, Row, Col, Card } from 'react-bootstrap';

function App() {
  const [salesData, setSalesData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [brandPerformanceData, setBrandPerformanceData] = useState([]);
  const [returnData, setReturnData] = useState([]);
  const [key, setKey] = useState('sales'); // State for active tab

  return (
    <div className="App">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">CSV/XLSX Visualizer</span>
        </div>
      </nav>

      <Container className="mt-4">
        <Row>
          <Col md={3}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Upload Sales Data</Card.Title>
                <Parser onDataParsed={setSalesData} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Upload Order Data</Card.Title>
                <OrderParser onDataParsed={setOrderData} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Upload Brand Performance Data</Card.Title>
                <BrandPerformanceParser onDataParsed={setBrandPerformanceData} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Upload Return Data</Card.Title>
                <ReturnParser onDataParsed={setReturnData} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col md={12}>
            <Tabs
              id="dashboard-tabs"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-3"
            >
              <Tab eventKey="sales" title="Sales Dashboard">
                <Dashboard data={salesData} />
              </Tab>
              <Tab eventKey="orders" title="Order Dashboard">
                <OrderDashboard data={orderData} />
              </Tab>
              <Tab eventKey="brand" title="Brand Performance Dashboard">
                <BrandPerformanceDashboard data={brandPerformanceData} />
              </Tab>
              <Tab eventKey="returns" title="Return Dashboard">
                <ReturnDashboard data={returnData} />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;