import React, { useEffect, useState } from 'react';
import './App.css';

interface Item {
  id: number;
  price: string;
  name: string;
  locality: string;
  labels: string;
  image: string;
}

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    fetch('http://localhost:5000/api/items')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error(error));
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const renderDropdownOptions = () => {
    const pageCount = Math.ceil(items.length / itemsPerPage);
    const options = [];

    for (let i = 1; i <= pageCount; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }

    return options;
  };

  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPage = Number(event.target.value);
    setCurrentPage(selectedPage);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Flats</h1>
      </header>
      <div className="pagination">
        <select value={currentPage} onChange={handleDropdownChange}>
          {renderDropdownOptions()}
        </select>
      </div>
      <ul>
        {currentItems.map(item => (
          <li className="App-item-list" key={item.id}>
            <p>ID: {item.id}</p>
            <p>Price: {item.price}</p>
            <p>Title: {item.name}</p>
            <p>Locality: {item.locality}</p>
            <p>Labels: {item.labels}</p>
            <img src={item.image} alt='property' />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
