
export default function InputSelect({label, defaultValue, value, name, onChange, children, error, ...etc}) {
  return (
    <div>
            <label htmlFor={name}>{label}</label>
            <select name={name} value={value} defaultValue={defaultValue ? defaultValue : "default"} onChange={onChange} {...etc}>
              <option value="default" disabled>
                Sélectionner une option
              </option>
           {children}
            </select>
            <p className="inputError">
          {error}
        </p>
          </div>
  )
}
