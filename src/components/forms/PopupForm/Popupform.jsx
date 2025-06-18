import styles from "./PopupForm.module.css";
import InputText from "../../ui/InputText";
import InputSelect from "../../ui/InputSelect";


export default function ProfileForm() {

  return (
    <div className={styles.borderPopup}>

      <form action="">
        
        <section className={`${styles.grid} ${styles.popupSection}`}>
          <InputText
            label="Nom"
            name="birthName"
            placeHolder="Nom de famille"
            value=""
            minLength={2}
            maxLength={50}
          />

          <InputText
            label="Prénom"
            name="firstName"
            placeHolder="Ex : Pierre"
            value=""
            minLength={2}
            maxLength={50}
          />
          <InputText
            label="Email"
            name="email"
            placeHolder="Ex : Pierredupont@gmail.fr"
            value=""
            minLength={5}
            maxLength={50}
          />

          <InputText
            label="Mot de passe"
            name="email"
            placeHolder="minimum 8 caractères dont 1 maj et 1 chiffre"
            value=""
            minLength={8}
            maxLength={15}
          />

          <InputSelect label="Rôle" name="Role">
            <option value="admin">Admin</option>
            <option value="superAdmin">Super Admin</option>
            <option value="formateur">Formateur</option>
          </InputSelect>
        </section>
        <div className={styles.popupButtons}>
          <button> Créer </button>
        </div>
      </form>
    </div>
  );
}
