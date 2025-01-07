import React, { useState } from "react";
import './CustomSelect.css';

const CustomSelect = ({ optionData, onChange }) => {
  const [currentValue, setCurrentValue] = useState(optionData[0].value);
  const [showOptions, setShowOptions] = useState(false);

  const handleOnChangeSelectValue = (e) => {
    const value = e.target.getAttribute("value");
    const key = parseInt(e.target.getAttribute("data-key"), 10); 
    setCurrentValue(value);
    onChange({ key, value });
  };

  return (
    <div className="select-box" onClick={() => setShowOptions((prev) => !prev)}>
      <label className="select-label">{currentValue}</label>
      <ul className={`select-options ${showOptions ? 'show' : ''}`}>
        {optionData.map((data) => (
          <li
            key={data.key}
            data-key={data.key}
            value={data.value}
            className="option"
            onClick={handleOnChangeSelectValue}
          >
            {data.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomSelect;
