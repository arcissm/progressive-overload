import * as React from "react";

const myData = [
  { value: 1, text: 'Books' },
  { value: 2, text: 'Movies, Music & Games' },
  { value: 3, text: 'Electronics & Computers' },
  { value: 4, text: 'Home, Garden & Tools' },
  { value: 5, text: 'Health & Beauty' },
  { value: 6, text: 'Toys, Kids & Baby' },
  { value: 7, text: 'Clothing & Jewelry' },
  { value: 8, text: 'Sports & Outdoors' },
  { value: 9, text: 'Automotive & Industrial' }
];

function MultipleSelect() {
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);

  // Handles change in the select element
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clickedValue = e.target.value;

    // Add or remove value from selectedValues array
    setSelectedValues((prevSelectedValues) => {
      if (prevSelectedValues.includes(clickedValue)) {
        // Remove if already selected
        return prevSelectedValues.filter((value) => value !== clickedValue);
      } else {
        // Add to array if not selected
        return [...prevSelectedValues, clickedValue];
      }
    });
  };

  return (
    <div>
      <label htmlFor="multi-select" style={{ marginBottom: '8px', display: 'block' }}>Multi-select</label>
      <select
        id="multi-select"
        multiple
        onChange={handleChange}
        style={{ width: '250px', height: '120px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
      >
        {myData.map((item) => (
          <option
            key={item.value}
            value={item.text}
            className={selectedValues.includes(item.text) ? 'selected' : ''} // Apply 'selected' class if it's selected
          >
            {item.text}
          </option>
        ))}
      </select>
      <div style={{ marginTop: '10px' }}>
        <strong>Selected:</strong> {selectedValues.length > 0 ? selectedValues.join(', ') : 'None'}
      </div>
    </div>
  );
}

//
export default function MultiSelect(): JSX.Element {
  const [result, setResult] = React.useState<number | null>(null);

  return (
    <>
      <MultipleSelect />
    </>
  );
}
