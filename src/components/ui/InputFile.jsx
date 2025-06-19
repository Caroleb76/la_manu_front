export default function InputFile({ name, value, onChange, error, id,...etc }) {
  return (
    <div>
      <label className="button" htmlFor={id}>Importer un fichier
        <input type="file" id={id} name={name} value={value} onChange={onChange} {...etc} />
      </label>
      {error && (
        <p className="inputError">
          {error}
        </p>
      )}
    </div>
  );
}
