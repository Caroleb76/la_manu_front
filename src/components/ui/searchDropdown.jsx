function SearchDropDown({
  value,
  onChange,
  options,
  valueField = "label",
  ...rest
}) {
  return (
    <div>
      <input
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        {...rest}
      />
      {options && options.length > 0 && (
        <ul>
          {options.map(option => (
            <li key={option.id}
              onClick={() => onChange(option.id)}>
              {option[valueField]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchDropDown;
