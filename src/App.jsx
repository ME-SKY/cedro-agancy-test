import React, { useState } from 'react';
import Select from './components/select';

const App = () => {
  const [selectedValue, setSelectedValue] = useState([]);

  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
  ];

  const handleCreateOption = (newLabel) => {
    const newOption = { value: newLabel.toLowerCase(), label: newLabel };
    options.push(newOption);
    return newOption;
  };

  return (
    <div style={{ padding: '20px' }}>
      <Select
        options={options}
        multiple
        value={selectedValue}
        onChange={setSelectedValue}
        onCreateOption={handleCreateOption}
      />
    </div>
  );
};

export default App;
