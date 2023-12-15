import React, { useEffect, useState } from 'react';
import TableComponent from './components/TableComponent';

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData()
      .then(response => setData(response))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const fetchData = async () => {
    const response = await fetch('http://localhost:5001/maladies');
    const data = await response.json();
    return data;
  };

  return (
    <div>
      <h1>Maladies</h1>
      <TableComponent data={data} />
      {/* Add other components or UI elements as needed */}
    </div>
  );
};

export default App;
