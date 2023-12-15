import React, { useState, useMemo } from 'react';
import { useTable } from 'react-table';
import FormComponent from './FormComponent';

const TableComponent = ({ data, fetchData }) => {
  const [file, setFile] = useState(null);

  const handleFileUpload = (e) => {
      const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('http://localhost:5001/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // green notification to show success for user
        console.log('File uploaded successfully');
      } else {
        // Handle error
        console.error('Error uploading file:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading file:', error.message);
    }
  };

  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Assuming the data has at least one item
    const sampleData = data[0] || {};

    return Object.keys(sampleData).map(key => ({
      Header: key,
      accessor: key,
    }));
  }, [data]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  // Display a message if no data is available
  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  return (
    <div>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileUpload} />
        <button type="submit">Upload</button>
      </form>
      <button onClick={toggleForm} style={{ float: 'right', margin: '10px' }}>
        ADD VIRUS
      </button>
      {showForm && <FormComponent fetchData={fetchData} toggleForm={toggleForm} />} {/* Render FormComponent if showForm is true */}
      <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f2f2f2' }}>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: '12px',
                      borderBottom: '1px solid #ddd',
                    }}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
