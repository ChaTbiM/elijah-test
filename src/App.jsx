import './App.css';
import AddTaxForm from './AddTaxForm';
import { useEffect, useState } from 'react';
import appliedData from './appliedData';
import data from "./data"

function App() {
  const [applicableTax, setApplicableTax] = useState()
  const [items, setItems] = useState()

  useEffect(() => {
    setTimeout(() => {
      appliedData.rate = appliedData.rate * 100;
      setApplicableTax(appliedData)
    }, 500);
    setTimeout(() => {
      setItems(data)
    }, 500);
  }, [setApplicableTax])

  return (
    <div className="App">
      <AddTaxForm appliedToData={applicableTax} list={items} />
    </div>
  );
}

export default App;
