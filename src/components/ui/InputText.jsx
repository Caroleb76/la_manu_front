export default function InputText({name, label, type, value, ...etc}) {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input type={type ? type : "text"} name={name} value={value} {...etc} />
    </div>
  );
}
