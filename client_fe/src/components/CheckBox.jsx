import React, { useState } from 'react';
import './CheckBox.css';

const CheckBox = ({ items = [], onChange }) => {
  const [checkedItems, setCheckedItems] = useState(
    items.reduce((acc, item) => {
      acc[item.key] = false;
      return acc;
    }, {})
  );

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems = {
        ...prevCheckedItems,
        [name]: checked,
      };
      onChange(Object.keys(newCheckedItems).filter(item => newCheckedItems[item]).map(item => parseInt(item)));
      return newCheckedItems;
    });
  };

  return (
    <div className="checkbox-container">
      {items.map((item) => (
        <label key={item.key} className="checkbox-label">
          <input
            className="checkBoxInput"
            type="checkbox"
            name={item.key}
            checked={checkedItems[item.key]}
            onChange={handleCheckboxChange}
          />
          {item.value}
        </label>
      ))}
    </div>
  );
};

export default CheckBox;
