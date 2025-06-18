export default function InputText({name, label, type, value, onChange,error, ...etc}) {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input type={type ? type : "text"} name={name} value={value} onChange={onChange} {...etc} />
       {error && (
        <p className="inputError">
          {error}
        </p>
      )}
    </div>
  );
}
