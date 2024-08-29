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

  const dropdownRef = useRef(null);

  useEffect(() => {
    function onScoll(e) {
      console.log('on scroll');
    }
  }, [])

  // const scrollPosition =

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
  // const [scrollbarHeight, ]


  

  // const value = controlledValue !== undefined ? controlledValue : internalValue;

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const filteredOptions = useMemo(() => {
    return options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [options, searchTerm])

  // const thumbHeight = useMemo(() => {
  //   if(dropdownRef.current && isOpen){
  //     const { scrollHeight, offsetHeight } = dropdownRef.current;
  //     const percentOfScroll = scrollHeight / 100;
  //     return offsetHeight / percentOfScroll;
  //   }  
  // }, [options, isOpen]);
  
  const value = useMemo(() => {
    console.log('useMemo valye', controlledValue);
    // if (multiple) {

    // } else {
    return internalValue;
    // }
  }, [internalValue]);

  function onScrollD(e) {
    // const area = 
    if (inputRef.current) {
      const { scrollTop, scrollHeight, offsetHeight } = dropdownRef.current;
      // const onePercentDroprownBlock = inputRef.current.offsetHeight / 100;
      const percentOfScroll = scrollHeight / 100;
      console.log('percentOfScroll', percentOfScroll);

      const posScrollInPercents = scrollTop / percentOfScroll;
      console.log('positionScorllInPercents', posScrollInPercents);

      // setScrollPosition(posScrollInPercents);

      // найти позицию скролла в процентах на всем скролленном блоке
      //всю высоту скролла разделить на сто процентов - находим значение одного процента для скролла в пикселях,
      //смотрим на текущую позицию скролла и делим на полученный процент в пикселях и получаем позицию скролла в процентах, 
      //эти проценты вписываем в текущую позицию скролла. ы
      // posScrollInPercents нужно перевести с помошью offsetHeight в пикселях

      const onePercentInOffsetHeight = offsetHeight / 100;

      const resultPosition = posScrollInPercents * onePercentInOffsetHeight;
      //сколько видимая область занимает в процентах от scrollHeight, видимая область это offsetheight, процент
      // const thumbHeightHm = offsetHeight / percentOfScroll;
      // setThumbHeight(thumbHeightHm);


      setScrollPosition(resultPosition);

    }
    console.log('on scroll dropdown here', e);
  }

  useEffect(() => {
    if(dropdownRef.current){
      console.log('dropdownRef.current', dropdownRef.current);
      
    }
    // function onScollDropdown(e) {

    // }
    // if (dropdownRef.current) {
    //   const { scrollTop } = dropdownRef.current;
    //   console.log()
    // }
  }, []);

  useLayoutEffect(() => {
    if(dropdownRef.current && isOpen){
      console.log('dropdownRef.current.style.maxHeight', parseInt(getComputedStyle(dropdownRef.current).maxHeight, 10));
      console.log('dropdownRef.current.offsetHeight', dropdownRef.current.offsetHeight);
      if (dropdownRef.current.offsetHeight < parseInt(getComputedStyle(dropdownRef.current).maxHeight, 10)) {
        // const maxHeight = parseInt(getComputedStyle(dropdownRef.current).maxHeight, 10);
        setThumbHeight(0);
        console.log('lower');
      } else {
        

        const { scrollHeight, offsetHeight } = dropdownRef.current;
        const percentOfScroll = scrollHeight / 100;
  
        // if()
        setThumbHeight(offsetHeight / percentOfScroll);
      }
     
    } 
  },[isOpen, filteredOptions])

  useEffect(() => {
    console.log('value is', value);
    // console.log()
    onChange && onChange(value);
  }, [value]);

  useEffect(() => {
    console.log('controlled value is', controlledValue);
    // if (inputRef.current) {
    // inputRef.current.focus();
    // }
  }, [controlledValue]);

  useEffect(() => {
    console.log('internal value is', internalValue);
  }, [internalValue]);

  const handleSelect = (option) => {
    console.log('handle select');
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

  // const handleInputChangeNonMultiple = (inputValue) => {
  // inputValue
  // }

  

  const handleCreateOption = () => {
    if (onCreateOption) {
      const newOption = onCreateOption(searchTerm);
      setInternalValue([...value, newOption]);
      setSearchTerm('');
    }
  };

  const calculateScrollPosition = () => {

  }

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
