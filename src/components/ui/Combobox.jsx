import { useState, useEffect, useRef } from "react";

/** Combobox expects:
 *  value: the selected id (string/number)
 *  onChange: (id) => void
 *  options: array of {id, label}
 *  label: input label
 *  loading: optional loading boolean
 */
const Combobox = ({
  value,
  onChange,
  options,
  label,
  loading = false,
  ...props
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showList, setShowList] = useState(false);
  const inputRef = useRef();

  // Keep inputValue in sync with selected id
  useEffect(() => {
    const found = options.find((option) => option.id === value);
    setInputValue(found ? found.label : "");
  }, [value, options]);

  // Filter options by label (case-insensitive substring match)
  const filtered = options.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase()),
  );

  // On select, set the id and display the label in the input
  const handleSelect = (option) => {
    onChange(option.id);
    setShowList(false);
  };

  return (
    <div style={{ position: "relative" }}>
      {label && <label>{label}</label>}
      <input
        ref={inputRef}
        type="text"
        autoComplete="off"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setShowList(true);
        }}
        onFocus={() => setShowList(true)}
        onBlur={() => setTimeout(() => setShowList(false), 100)} // Delay to allow click selection
        {...props}
      />
      {loading && <div className="spinner" />}
      {showList && filtered.length > 0 && (
        <ul
          style={{
            position: "absolute",
            background: "#fff",
            border: "1px solid #ccc",
            zIndex: 1,
            width: "100%",
            margin: 0,
            padding: 0,
            listStyle: "none",
          }}
        >
          {filtered.map((option) => (
            <li
              key={option.id}
              style={{
                padding: "0.5em",
                cursor: "pointer",
                background: value === option.id ? "#eef" : "transparent",
              }}
              onMouseDown={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Combobox;
