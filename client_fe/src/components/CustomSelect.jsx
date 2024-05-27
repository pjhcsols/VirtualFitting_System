import React, { useState } from "react";
import './CustomSelect.css';

const CustomSelect = ({ optionData }) => {
  const [currentValue, setCurrentValue] = useState(optionData[0].value);
  const [showOptions, setShowOptions] = useState(false);

  const handleOnChangeSelectValue = (e) => {
    setCurrentValue(e.target.getAttribute("value"));
  };

  return (
    <div className="select-box" onClick={() => setShowOptions((prev) => !prev)}>
      <label className="select-label">{currentValue}</label>
      <ul className={`select-options ${showOptions ? 'show' : ''}`}>
        {optionData.map((data) => (
          <li
            key={data.key}
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