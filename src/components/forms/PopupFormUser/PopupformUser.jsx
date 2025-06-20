import styles from "./PopupFormUser.module.css";
import InputText from "../../ui/InputText";
import InputSelect from "../../ui/InputSelect";
import { useEffect, useState } from "react";
import rolesHelper from "../../../helpers/rolesHelper";
import usersHelper from "../../../helpers/usersHelper";

export default function PopupFormUser({onUserCreated}) {
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
      onUserCreated();
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: ''
      });
    }else{
      alert(response.message);
    }
  }

  return (
    <div className={styles.borderPopup}>

      <form action="" onSubmit={hahndleSubmit}>

        <section className={`${styles.grid} ${styles.popupSection}`}>
          <InputText
            label="Nom"
            name="lastName"
            placeholder="Nom de famille"
            value={formData.lastName}
            onChange={handleFormChange}

            maxLength={50}
          />

          <InputText
            label="Prénom"
            name="firstName"
            placeholder="Ex : Pierre"
            value={formData.firstName}
            onChange={handleFormChange}
            minLength={2}
            maxLength={50}
          />
          <InputText
            label="Email"
            name="email"
            placeholder="Ex : Pierredupont@gmail.fr"
            value={formData.email}
            onChange={handleFormChange}
            minLength={5}
            maxLength={50}
          />

          <InputText
            label="Mot de passe"
            name="password"
            placeholder="minimum 8 caractères dont 1 maj et 1 chiffre"
            type="password"
            value={formData.password}
            onChange={handleFormChange}
            minLength={8}
            maxLength={15}
          />

          <InputSelect label="Rôle" name="role" value={formData.role} onChange={handleFormChange}>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </InputSelect>
        </section>
        <div className={styles.popupButtons}>
          <button> Créer </button>
        </div>
      </form>
    </div>
  );
}
