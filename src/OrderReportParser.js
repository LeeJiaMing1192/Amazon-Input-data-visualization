
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const OrderReportParser = ({ onDataParsed }) => {
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
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
  }, [onDataParsed]);

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
      'id', 'number_of_items', 'quantity', 'item_price', 'item_tax', 'shipping_price', 'shipping_tax', 'gift_wrap_price', 'gift_wrap_tax', 'item_promotion_discount', 'ship_promotion_discount', 'amazon_order_id', 'merchant_order_id', 'order_status', 'fulfillment_channel', 'sales_channel', 'order_channel', 'url', 'ship_service_level', 'product_name', 'sku', 'asin', 'item_status', 'tax_collection_model', 'tax_collection_responsible_party', 'currency', 'address_type', 'ship_city', 'ship_state', 'ship_postal_code', 'ship_country', 'promotion_ids', 'payment_method_details', 'cpf', 'item_extensions_data', 'purchase_order_number', 'price_designation', 'customized_url', 'customized_page', 'original_order_id', 'default_ship_from_address_name', 'default_ship_from_address_field_1', 'default_ship_from_address_field_2', 'default_ship_from_address_field_3', 'default_ship_from_city', 'default_ship_from_state', 'default_ship_from_country', 'default_ship_from_postal_code', 'actual_ship_from_address_name', 'actual_ship_from_address_field_1', 'actual_ship_from_address_field_2', 'actual_ship_from_address_field_3', 'actual_ship_from_city', 'actual_ship_from_state', 'actual_ship_from_country', 'actual_ship_from_postal_code', 'is_business_order', 'is_replacement_order', 'is_exchange_order', 'is_transparency', 'date', 'created_at', 'purchase_date'
    ];

    const headers = Object.keys(parsedData[0] || {});
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));

    if (missingColumns.length > 0) {
        setError(`The following columns are missing: ${missingColumns.join(', ')}`);
        onDataParsed([]);
        return;
    }

    onDataParsed(parsedData);
    setError('');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
      <input {...getInputProps()} accept=".csv, .xlsx" />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default OrderReportParser;
