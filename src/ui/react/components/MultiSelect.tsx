import React, { useState, useEffect } from "react";

interface MultiSelectInputProps {
  options: string[];
  selectedValues?: string[]; // Optional prop to receive pre-selected values
  onSelectionChange: (selected: string[]) => void; // Callback function prop
}

function MultiSelectInput({ options, selectedValues = [], onSelectionChange }: MultiSelectInputProps) {
  const [internalSelectedValues, setInternalSelectedValues] = useState<string[]>(selectedValues);
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Update internal selected values if the parent updates the selectedValues prop
  useEffect(() => {
    setInternalSelectedValues(selectedValues);
  }, [selectedValues]);

  // Filter options based on the input value and exclude already selected values
  const filteredOptions = options.filter((item) =>
    item.toLowerCase().includes(inputValue.toLowerCase()) &&
    !internalSelectedValues.includes(item)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Multiseelect")
    console.log(showDropdown)
    console.log(inputValue)
    setInputValue(e.target.value);
    setShowDropdown(true);
  };

  const handleOptionClick = (optionText: string) => {
    if (!internalSelectedValues.includes(optionText)) {
      const newSelectedValues = [...internalSelectedValues, optionText];
      setInternalSelectedValues(newSelectedValues);
      onSelectionChange(newSelectedValues); // Notify the parent of the change
    }
    setInputValue("");
    setShowDropdown(false);
  };

  const handleRemoveClick = (optionText: string) => {
    const updatedValues = internalSelectedValues.filter((value) => value !== optionText);
    setInternalSelectedValues(updatedValues);
    onSelectionChange(updatedValues); // Notify the parent of the change
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 150);
  };

  return (
    <div className="multi-select-container">
      <div className="selected-values-container">
        {internalSelectedValues.map((value) => (
          <div key={value} className="selected-tag">
            {value}
            <span
              className="remove-icon"
              onClick={() => handleRemoveClick(value)}
            >
              ×
            </span>
          </div>
        ))}
        </div>
        <div>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onClick={() => setShowDropdown(true)}
            onBlur={handleBlur}
            placeholder="Select..."
            className="multi-select-input"
          />
      </div>
      {showDropdown && filteredOptions.length > 0 && (
        <ul className="dropdown-list">
          {filteredOptions.map((item, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(item)}
              className={`dropdown-item ${internalSelectedValues.includes(item) ? 'selected' : ''}`}
              onMouseDown={(e) => e.preventDefault()} 
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MultiSelectInput;
