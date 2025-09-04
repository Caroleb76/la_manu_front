
export default function SearchDropDown({name, label, type, value="", onChange,error, options,valueField=null, onSelect, onChangeParam,loading=false, ...etc}) {
  return (
    <div style={{ position: "relative" }}>
      <label htmlFor={name}>{label}</label>
      <input type={type ? type : "text"} autoComplete="off" name={name} value={value} onChange={(e)=>{onChangeParam(e)}} {...etc} />
      {options && options.length > 0 && (
        <ul className="searchDropdown">
          {options.map((option, index) => (
            <li key={index} onClick={() => onSelect(option)}>
              {valueField ? option[valueField] : option}
            </li>
          ))}
        </ul>
      )}
        {loading && <div className="spinner"></div>}
       {error && (
        <p className="inputError">
          {error}
        </p>
      )}
    </div>
  );
}
