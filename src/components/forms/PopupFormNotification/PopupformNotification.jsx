import styles from "./PopupFormNotification.module.css";
import InputText from "../../ui/InputText";
import InputSelect from "../../ui/InputSelect";
import { useEffect, useState } from "react";

import usersHelper from "../../../helpers/usersHelper";

export default function PopupFormNotification({ onUserCreated }) {
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: ''
  });
  useEffect(() => {
    async function loadRoles() {
      const response = await rolesHelper.getRoles();
      setRoles(response.data);


    }
    loadRoles();

  }, [])

  function handleFormChange(e) {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function hahndleSubmit(e) {
    e.preventDefault();
    const response = await usersHelper.createUser(formData);
    if (response.success) {
      alert("utilisateur créer");
      onUserCreated();
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: ''
      });
    } else {
      alert(response.message);
    }
  }

  return (
    <div className={styles.borderPopup}>

      <form action="" onSubmit={hahndleSubmit}>

        <section className={`${styles.grid} ${styles.popupSection}`}>

        
 <InputText
            label="Date de publication"
            name="startDate"
            type="date"
            value={formData.startDate}
            
          />

  <InputText
            label="Date d'expiration"
            name="endDate"
            type="date"
            value={formData.endDate}
            
          />
  <InputSelect label="Priorité" name="priority" value={formData.role} onChange={handleFormChange}>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </InputSelect>

                 
        </section>
         <InputText
            label="Contenu"
            name="content"
            placeholder="contenu de la notification"
            value={formData.text}
            onChange={handleFormChange}
            minLength={5}
            maxLength={250}
            
          />

        <div className={styles.popupButtons}>
          <button> Créer </button>
        </div>
      </form>
    </div>
  );
}
