import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { excelSerialDateToJSDate } from './utils'; // Added this import

const BrandPerformanceParser = ({ onDataParsed }) => {
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
      'Date',
      'ASIN',
      'Title',
      'Brand Name',
      'Average Customer Review',
      'Number of Customer Reviews',
      'Sales Rank',
      'Featured Offer (Buy Box) Percentage',
      'Featured Offer (Buy Box) Percentage - B2B'
    ];

    if (!parsedData || parsedData.length === 0) {
        setError('No data found in the file.');
        onDataParsed([]);
        return;
    }

    const headers = Object.keys(parsedData[0]);
    console.log('Detected headers:', headers);

    const missingColumns = requiredColumns.filter(col => !headers.includes(col));

    if (missingColumns.length > 0) {
        setError(`The following columns are missing: ${missingColumns.join(', ')}`);
        onDataParsed([]);
        return;
    }

    const processedDatesData = parsedData.map(row => ({
        ...row,
        Date: typeof row.Date === 'number' ? excelSerialDateToJSDate(row.Date) : new Date(row.Date)
    }));

    console.log('Raw parsed data (first 5 rows) from BrandPerformanceParser:', processedDatesData.slice(0, 5).map(row => row.Date));

    onDataParsed(processedDatesData);
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

export default BrandPerformanceParser;