import React from 'react'

function CustomDropdown({ selectButton, otherCustomElements, value, options, onSelect, onCreateOption, ...props }) {
  return (
    <div className={props.className ? props.className : 'custom-dropdown-options'}>
      {options.map(option => (
        <div
          key={option.value}
          className={`c-dropdown-option ${value.filter(val => option.value === val.value).length > 0 ? 'selected' : ''}`}
          onClick={() => onSelect(option)}
        >
          {option.avatar && <div className="c-avatar"></div>}
          {option.icon && <div className="c-icon"></div>}
          <div className='c-label'>{option.label}</div>
          
        </div>
      ))}
      {searchTerm && !options.length && (
        <div className="create-option" onClick={onCreateOption}>
          Create "{searchTerm}"
        </div>
      )}
    </div>
  )
}

export default CustomDropdown