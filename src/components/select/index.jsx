import React, { useState, useEffect, useRef, useMemo, useLayoutEffect } from 'react';
import './select.css';
import dropdownArrow from '../../assets/dropdown-arrow.svg';

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
}) => {

  return (
    <div className="dropdown-options">
      {options.map(option => (
        <div
          key={option.value}
          className={`dropdown-option ${value.includes(option) ? 'selected' : ''}`}
          onClick={() => { console.log('on click -> on select'); onSelect(option) }}
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
  )
};

export default function Select({ options,
  multiple = false,
  title,
  customDropdownComponent: CustomDropdownComponent,
  customLabelComponent: CustomLabelComponent,
  onCreateOption,
  onChange,
  value: controlledValue,
  placeholder = 'Select...' }) {

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [internalValue, setInternalValue] = useState(controlledValue || []);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(0);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const filteredOptions = useMemo(() => {
    return options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [options, searchTerm])
  
  const value = useMemo(() => {
    return internalValue;
  }, [internalValue]);

  function onScrollD(e) {
    if (inputRef.current) {
      const { scrollTop, scrollHeight, offsetHeight } = dropdownRef.current;
      const percentOfScroll = scrollHeight / 100;
      const posScrollInPercents = scrollTop / percentOfScroll;
      const onePercentInOffsetHeight = offsetHeight / 100;
      const resultPosition = posScrollInPercents * onePercentInOffsetHeight;
      setScrollPosition(resultPosition);
    }
  }

  useLayoutEffect(() => {
    if(dropdownRef.current && isOpen){
      if (dropdownRef.current.offsetHeight < parseInt(getComputedStyle(dropdownRef.current).maxHeight, 10)) {
        setThumbHeight(0);
      } else {
        const { scrollHeight, offsetHeight } = dropdownRef.current;
        const percentOfScroll = scrollHeight / 100;
  
        setThumbHeight(offsetHeight / percentOfScroll);
      }
     
    } 
  },[isOpen, filteredOptions])

  useEffect(() => {
    onChange && onChange(value);
  }, [value]);


  const handleSelect = (option) => {
    if (multiple) {
      const newValue = value.includes(option)
        ? value.filter(v => v !== option)
        : [...value, option];
      setInternalValue(newValue);
      setSearchTerm('');
    } else {
      setInternalValue([option]);
      setSearchTerm(option.label);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }

    setIsOpen(false);
  };

  const handleRemove = (option) => {
    const newValue = value.filter(v => v !== option);
    setInternalValue(newValue);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCreateOption = () => {
    if (onCreateOption) {
      const newOption = onCreateOption(searchTerm);
      setInternalValue([...value, newOption]);
      setSearchTerm('');
    }
  };

  return (
    <div className="select-container">
      {title && <h4 className='select-title'>{title}</h4>}
      <div className="select-input" >
        <div className="input-with-selected-options">
          {multiple === true && options.map(option =>
            <DefaultLabelComponent key={option.value} option={option} onRemove={() => handleRemove(option)} />)}
          {multiple ? <input
            ref={inputRef}
            type="text"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={value.length === 0 ? placeholder : ''}
            onClick={() => setIsOpen(!isOpen)}
          // onFocus={() => setIsOpen(true)}
          // onBlur={() => setIsOpen(false)}
          /> :
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={value.length === 0 ? placeholder : ''}
              onClick={() => setIsOpen(!isOpen)}
            // onFocus={() => setIsOpen(true)}
            // onBlur={() => setIsOpen(false)}
            />
          }
          <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            style={{ backgroundImage: `url(${dropdownArrow})` }}></span>
        </div>
      </div>
      {isOpen && (
        <>
          {CustomDropdownComponent ? (
            <CustomDropdownComponent
              options={filteredOptions}
              value={value}
              onSelect={handleSelect}
              onCreateOption={handleCreateOption}
              searchTerm={searchTerm}
            />
          ) : (
            <>
              <div className="dropdown" ref={dropdownRef} onScroll={onScrollD} data-scrollposition={scrollPosition} >
                <DefaultDropdownComponent
                  options={filteredOptions}
                  value={value}
                  onSelect={handleSelect}
                  onCreateOption={handleCreateOption}
                  searchTerm={searchTerm}
                  onScrolling={calculateScrollPosition}
                />
              </div>
              <div className="vertical-scroll" style={{display: thumbHeight > 0 ? 'block' : 'none'}}>
                <div className='vertical-scrollbar-thumb' style={{ top: `${scrollPosition}px`, height: `${thumbHeight}%` }}>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
