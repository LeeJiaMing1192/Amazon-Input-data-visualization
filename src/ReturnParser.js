import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

const ReturnParser = ({ onDataParsed }) => {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        const binaryStr = reader.result;

        if (file.name.endsWith('.csv')) {
          Papa.parse(binaryStr, {
            header: true,
            complete: (results) => {
              onDataParsed(results.data);
            },
            error: (err) => {
              console.error('CSV parsing error:', err);
            },
          });
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          const workbook = XLSX.read(binaryStr, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          onDataParsed(json);
        } else {
          alert('Unsupported file type. Please upload a CSV or XLSX file.');
        }
      };
      reader.readAsBinaryString(file);
    });
  }, [onDataParsed]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      <p>Drag 'n' drop some return data files here, or click to select files</p>
    </div>
  );
};

export default ReturnParser;
