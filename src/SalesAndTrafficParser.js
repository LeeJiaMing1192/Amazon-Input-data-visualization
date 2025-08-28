
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const SalesAndTrafficParser = ({ onDataParsed }) => {
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
      'id', 'sessions_mobile_app', 'sessions_mobile_app_b2b', 'sessions_browser', 'sessions_browser_b2b', 'sessions_total', 'sessions_total_b2b', 'page_views_mobile_app', 'page_views_mobile_app_b2b', 'page_views_browser', 'page_views_browser_b2b', 'page_views_total', 'page_views_total_b2b', 'units_ordered', 'units_ordered_b2b', 'total_order_items', 'total_order_items_b2b', 'session_pct_mobile_app', 'session_pct_mobile_app_b2b', 'session_pct_browser', 'session_pct_browser_b2b', 'session_pct_total', 'session_pct_total_b2b', 'page_views_pct_mobile_app', 'page_views_pct_mobile_app_b2b', 'page_views_pct_browser', 'page_views_pct_browser_b2b', 'page_views_pct_total', 'page_views_pct_total_b2b', 'featured_offer_pct', 'featured_offer_pct_b2b', 'unit_session_pct', 'unit_session_pct_b2b', 'ordered_product_sales', 'ordered_product_sales_b2b', 'parent_asin', 'child_asin', 'title', 'date', 'created_at'
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

export default SalesAndTrafficParser;
