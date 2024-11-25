import React, { useState, useEffect } from "react";

interface MultiSelectInputProps {
  options: string[];
  selectedValues?: string[];
  onSelectionChange: (selected: string[]) => void;
  disabled?: boolean;
}

function MultiSelectInput({
  options,
  selectedValues = [],
  onSelectionChange,
  disabled = false,
}: MultiSelectInputProps) {
  const [internalSelectedValues, setInternalSelectedValues] = useState<string[]>(selectedValues);
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setInternalSelectedValues(selectedValues);
  }, [selectedValues]);

  const filteredOptions = options.filter(
    (item) =>
      item.toLowerCase().includes(inputValue.toLowerCase()) &&
      !internalSelectedValues.includes(item)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    setInputValue(e.target.value);
    setShowDropdown(true);
  };

  const handleOptionClick = (optionText: string) => {
    if (disabled) return;
    if (!internalSelectedValues.includes(optionText)) {
      const newSelectedValues = [...internalSelectedValues, optionText];
      setInternalSelectedValues(newSelectedValues);
      onSelectionChange(newSelectedValues);
    }
    setInputValue("");
    setShowDropdown(false);
  };

  const handleRemoveClick = (optionText: string) => {
    if (disabled) return;
    const updatedValues = internalSelectedValues.filter((value) => value !== optionText);
    setInternalSelectedValues(updatedValues);
    onSelectionChange(updatedValues);
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
            {!disabled && (
              <span className="remove-icon" onClick={() => handleRemoveClick(value)}>
                ×
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="custom-select-input-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onClick={() => !disabled && setShowDropdown(true)}
          onBlur={handleBlur}
          placeholder="Select..."
          className="multi-select-input"
          disabled={disabled}
        />
      </div>
      {showDropdown && filteredOptions.length > 0 && (
        <ul className="dropdown-list">
          {filteredOptions.map((item, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(item)}
              className={`dropdown-item ${
                internalSelectedValues.includes(item) ? "selected" : ""
              }`}
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
