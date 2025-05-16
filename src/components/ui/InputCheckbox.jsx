export default function InputCheckbox({name, label, checked, ...etc}) {
  return (
    <div className="inputCheckbox">

      <input type="checkbox" name={name} checked={checked} {...etc}/>
      <label htmlFor={name}>{label}
   
      </label>
      
    </div>
  );
}

