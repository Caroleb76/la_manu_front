export default function InputSelect({
    label,
className,
    value,
    name,
    onChange,
    children,
    error,
    ...etc
}) {
    return (
        <div className={className}>
            <label htmlFor={name}>{label}</label>
            <select
                name={name}
                value={value}
defaultValue={"default"}
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
