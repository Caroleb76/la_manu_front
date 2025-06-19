export default function InputSelect({
    label,

    value,
    name,
    onChange,
    children,
    error,
    ...etc
}) {
    return (
        <div>
            <label htmlFor={name}>{label}</label>
            <select
                name={name}
                value={value}

                onChange={onChange}
                {...etc}
            >
                <option value="default" disabled>
                    Sélectionner une option
                </option>
                {children}
            </select>
            <p className="inputError">{error}</p>
        </div>
    );
}
