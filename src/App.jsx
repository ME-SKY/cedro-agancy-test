import React, { useState } from 'react';
import Select from './components/select';

const App = () => {
  const [selectedValue, setSelectedValue] = useState([]);

  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'pineapple', label: 'Pineapple' },
    { value: 'orange', label: 'Orange' },
    { value: 'kiwi', label: 'Kiwi' },
    { value: 'mango', label: 'Mango' },
    { value: 'grape', label: 'Grape' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'blueberry', label: 'Blueberry' },
    { value: 'raspberry', label: 'Raspberry' },
    { value: 'blackberry', label: 'Blackberry' },
    { value: 'peach', label: 'Peach' },
    { value: 'melon', label: 'Melon' },
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
        multiple = {false}
        value={selectedValue}
        onChange={setSelectedValue}
        onCreateOption={handleCreateOption}
      />
    </div>
  );
};

export default App;
