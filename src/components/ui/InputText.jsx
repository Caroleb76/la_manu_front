export default function InputText({name, label, type, value, onChange,error,className,min, max, ...etc}) {
  return (
    <div className={className}>
      <label htmlFor={name}>{label}</label>
      <input type={type ? type : "text"} name={name} value={value} onChange={onChange} min={min} max={max} {...etc}  />
       {error && (
        <p className="inputError">
          {error}
        </p>
      )}
    </div>
  );
}
