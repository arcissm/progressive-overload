import React, { useState, useEffect } from 'react';

interface SingleSelectProps {
  options: string[];
  selectedValue?: string; // Optional pre-selected value
  onSelectionChange: (selected: string) => void; // Callback function prop for a single value
  placeholder?: string;
}

const SingleSelect: React.FC<SingleSelectProps> = ({
  options,
  selectedValue = '', // Initialize with an empty string if not provided
  onSelectionChange,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Initialize input value with the provided selectedValue
  useEffect(() => {
    if (selectedValue) {
      setInputValue(selectedValue);
    }
  }, [selectedValue]);

  // Filter options based on input value
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true); // Open dropdown when typing
  };

  const handleOptionClick = (option: string) => {
    setInputValue(option); // Set the input value to the selected option
    setIsOpen(false); // Close the dropdown after selection
    onSelectionChange(option); // Call the callback with the selected option
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = () => {
    // Delay closing to allow clicking on options
    setTimeout(() => setIsOpen(false), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredOptions.length > 0) {
      handleOptionClick(filteredOptions[0]); // Select the first option
    }
  };

  return (
    <div className='single-select-container'>
        <div className='custom-select-input-container'>
            <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown} // Add the key down event handler
            placeholder={placeholder || 'Select an option...'}
            />
        </div>
      {isOpen && (
        <ul
          className="dropdown-list"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={index}
                onMouseDown={() => handleOptionClick(option)}
                className='dropdown-item'
              >
                {option}
              </li>
            ))
          ) : (
            <li className='dropdown-item'>No options found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SingleSelect;
