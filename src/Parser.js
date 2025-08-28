
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const Parser = ({ onDataParsed }) => {
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
      'Date', '(Parent) ASIN', '(Child) ASIN', 'Title', 'Sessions - Mobile App', 
      'Sessions - Mobile APP - B2B', 'Sessions - Browser', 'Sessions - Browser - B2B', 
      'Sessions - Total', 'Sessions - Total - B2B', 'Session Percentage - Mobile App', 
      'Session Percentage - Mobile APP - B2B', 'Session Percentage - Browser', 
      'Session Percentage - Browser - B2B', 'Session Percentage - Total', 
      'Session Percentage - Total - B2B', 'Page Views - Mobile App', 
      'Page Views - Mobile APP - B2B', 'Page Views - Browser', 'Page Views - Browser - B2B', 
      'Page Views - Total', 'Page Views - Total - B2B', 'Page Views Percentage - Mobile App', 
      'Page Views Percentage - Mobile App - B2B', 'Page Views Percentage - Browser', 
      'Page Views Percentage - Browser - B2B', 'Page Views Percentage - Total', 
      'Page Views Percentage - Total - B2B', 'Featured Offer (Buy Box) Percentage', 
      'Featured Offer (Buy Box) Percentage - B2B', 'Units Ordered', 'Units Ordered - B2B', 
      'Unit Session Percentage', 'Unit Session Percentage - B2B', 'Ordered Product Sales', 
      'Ordered Product Sales - B2B', 'Total Order Items', 'Total Order Items - B2B'
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

export default Parser;
