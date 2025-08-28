
import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import Parser from './Parser';
import OrderParser from './OrderParser';
import BrandPerformanceParser from './BrandPerformanceParser';
import ReturnParser from './ReturnParser';
import OrderReportParser from './OrderReportParser';
import SalesAndTrafficParser from './SalesAndTrafficParser';

const FileUpload = ({ onDataParsed }) => {
  return (
    <Card className="mb-4">
      <Card.Header as="h5">Upload Data Files</Card.Header>
      <Card.Body>
        <Row>
          <Col md={3}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Sales Data</Card.Title>
                <Parser onDataParsed={(data) => onDataParsed('sales', data)} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Order Data</Card.Title>
                <OrderParser onDataParsed={(data) => onDataParsed('order', data)} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Brand Performance</Card.Title>
                <BrandPerformanceParser onDataParsed={(data) => onDataParsed('brand', data)} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Return Data</Card.Title>
                <ReturnParser onDataParsed={(data) => onDataParsed('return', data)} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Order Report</Card.Title>
                <OrderReportParser onDataParsed={(data) => onDataParsed('order_report', data)} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Sales and Traffic</Card.Title>
                <SalesAndTrafficParser onDataParsed={(data) => onDataParsed('sales_and_traffic', data)} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default FileUpload;
