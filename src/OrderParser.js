import React, { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const OrderParser = ({ onDataParsed }) => {
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError('Please select a file.');
      return;
    }

    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (fileExtension === 'csv') {
      parseCSV(file);
    } else if (fileExtension === 'xlsx') {
      parseXLSX(file);
    } else {
      setError('Unsupported file type. Please select a CSV or XLSX file.');
    }
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        processData(results.data);
      },
      error: (err) => {
        setError('Error parsing CSV: ' + err.message);
      }
    });
  };

  const parseXLSX = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      processData(json);
    };
    reader.onerror = (err) => {
        setError('Error reading XLSX file: ' + err.message);
    }
    reader.readAsArrayBuffer(file);
  };

  const processData = (parsedData) => {
    const requiredColumns = [
        'amazon-order-id', 'merchant-order-id', 'purchase-date', 'last-updated-date', 'order-status', 'fulfillment-channel', 'sales-channel', 'order-channel', 'url', 'ship-service-level', 'product-name', 'sku', 'asin', 'number-of-items', 'item-status', 'tax-collection-model', 'tax-collection-responsible-party', 'quantity', 'currency', 'item-price', 'item-tax', 'shipping-price', 'shipping-tax', 'gift-wrap-price', 'gift-wrap-tax', 'item-promotion-discount', 'ship-promotion-discount', 'address-type', 'ship-city', 'ship-state', 'ship-postal-code', 'ship-country', 'promotion-ids', 'payment-method-details', 'cpf', 'item-extensions-data', 'is-business-order', 'purchase-order-number', 'price-designation', 'customized-url', 'customized-page', 'is-replacement-order', 'is-exchange-order', 'original-order-id', 'is-transparency', 'default-ship-from-address-name', 'default-ship-from-address-field-1', 'default-ship-from-address-field-2', 'default-ship-from-address-field-3', 'default-ship-from-city', 'default-ship-from-state', 'default-ship-from-country', 'default-ship-from-postal-code', 'actual-ship-from-address-name', 'actual-ship-from-address-field-1', 'actual-ship-from-address-field-2', 'actual-ship-from-address-field-3', 'actual-ship-from-city', 'actual-ship-from-state', 'actual-ship-from-country', 'actual-ship-from-postal-code', 'signature-confirmation-recommended'
    ];

    const headers = Object.keys(parsedData[0]);
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));

    if (missingColumns.length > 0) {
        setError(`The following columns are missing: ${missingColumns.join(', ')}`);
        onDataParsed([]);
        return;
    }

    onDataParsed(parsedData);
    setError('');
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".csv, .xlsx" />
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default OrderParser;
