export default function InputCheckbox({ name, label, checked, error, ...etc }) {
  return (
    <div className="inputCheckbox">
      <label htmlFor={name}>
        <input
          type="checkbox"
          name={name}
          checked={checked}
          className="inputCheckbox__input"
          {...etc}
        />
        {label}
      </label>
      <p className="inputError">{error}</p>
    </div>
  );
}
