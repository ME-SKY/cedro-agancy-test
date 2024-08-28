import React, { useState, useEffect } from 'react';
import './select.css';

const DefaultLabelComponent = ({ option, onRemove }) => (
  <div className="label">
    {option.label}
    <button onClick={onRemove}>✕</button>
  </div>
);

const DefaultDropdownComponent = ({
  options,
  value,
  onSelect,
  onCreateOption,
  searchTerm,
}) => (
  <div className="dropdown-options">
    {options.map(option => (
      <div
        key={option.value}
        className={`dropdown-option ${value.includes(option) ? 'selected' : ''}`}
        onClick={() => onSelect(option)}
      >
        {option.label}
        {value.includes(option) && <span>✔</span>}
      </div>
    ))}
    {searchTerm && !options.length && (
      <div className="create-option" onClick={onCreateOption}>
        Create "{searchTerm}"
      </div>
    )}
  </div>
);



export default function Select({ options,
  multiple = false,
  customDropdownComponent: CustomDropdownComponent,
  customLabelComponent: CustomLabelComponent,
  onCreateOption,
  onChange,
  value: controlledValue,
  placeholder = 'Select...' }) {

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [internalValue, setInternalValue] = useState(controlledValue || []);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const inputRef = useRef(null);

  useEffect(() => {
    onChange && onChange(value);
  }, [value]);

  const handleSelect = (option) => {
    if (multiple) {
      const newValue = value.includes(option)
        ? value.filter(v => v !== option)
        : [...value, option];
      setInternalValue(newValue);
    } else {
      setInternalValue([option]);
      setIsOpen(false);
    }
    setSearchTerm('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleRemove = (option) => {
    const newValue = value.filter(v => v !== option);
    setInternalValue(newValue);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateOption = () => {
    if (onCreateOption) {
      const newOption = onCreateOption(searchTerm);
      setInternalValue([...value, newOption]);
      setSearchTerm('');
    }
  };

  return (
    <div className="select-container">
      <div className="select-input" onClick={() => setIsOpen(!isOpen)}>
        <div className="input-with-selected-options">
          {value.map(option =>
            <DefaultLabelComponent key={option.value} option={option} onRemove={() => handleRemove(option)} />)}
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={value.length === 0 ? placeholder : ''}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
          />
        </div>

      </div>
      {isOpen && (
        <div className="dropdown">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {CustomDropdownComponent ? (
            <CustomDropdownComponent
              options={filteredOptions}
              value={value}
              onSelect={handleSelect}
              onCreateOption={handleCreateOption}
              searchTerm={searchTerm}
            />
          ) : (
            <DefaultDropdownComponent
              options={filteredOptions}
              value={value}
              onSelect={handleSelect}
              onCreateOption={handleCreateOption}
              searchTerm={searchTerm}
            />
          )}
        </div>
      )}
    </div>
  )
}
