import React from 'react'

export default function InputSelect({label, defaultValue, value, name, children, ...etc}) {
  return (
    <div>
            <label htmlFor={name}>{label}</label>
            <select name={name} value={value} defaultValue={"default"} {...etc}>
              <option value="default" disabled>
                Sélectionner une option
              </option>
           {children}
            </select>
          </div>
  )
}
