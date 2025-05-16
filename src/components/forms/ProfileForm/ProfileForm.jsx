import styles from "./ProfileForm.module.css";
import InputText from "../../ui/InputText";
import InputCheckbox from "../../ui/InputCheckbox";
import InputSelect from "../../ui/InputSelect";
import { useState } from "react";

export default function ProfileForm() {
  const [selectedFileType, setSelectedFileType] = useState(null);
  return (
    <div>
      <form action="">
        <section className={`${styles.grid} ${styles.profileSection}`}>
          <div className={styles.profileIconTitleWrapper}>
            <div className={styles.profileIconWrapper}>
              <div className={styles.profileIcon}>
                <p>AB</p>
              </div>
            </div>
            <h2 className="title">Etat civil</h2>
          </div>

          <InputSelect label="Civilité" name="gender">
            <option value="madame">Madame</option>
            <option value="monsieur">Monsieur</option>
          </InputSelect>

          <InputText
            label="Nom patronymique"
            name="lastName"
            placeHolder="Nom de jeune fille"
            value=""
            minLength={2}
            maxLength={50}
          />
          <InputText
            label="Nom d'usage"
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
            label="Date de naissance"
            type="date"
             placeHolder="Ex : 25/03/1966"
            name="birthDate"
            value=""
          />
          <InputText
            label="Lieu de naissance"
            name="birthPlace"
             placeHolder="Ex : Le Havre"
            value=""
            minLength={2}
            maxLength={50}
          />

          <InputText
            label="Numéro de sécurité sociale"
            name="socialSecurity"
             placeHolder="Ex : 1591176365125 56"
            value=""
            minLength={15}
            maxLength={15}
          />
        </section>

        {/* 2ème section */}
        <section className={styles.profileSection}>
          <h2 className="title">Coordonnées</h2>
          <div className={styles.grid}>
            <InputText
              label="Adresse"
              name="address"
               placeHolder="Ex : 11 rue des Lilas"
              value=""
              minLength={2}
              maxLength={100}
            />

            <InputText
              label="Code postal"
              name="postalCode"
               placeHolder="Ex : 76600"
              value=""
              minLength={5}
              maxLength={5}
            />

            <InputText
              label="Ville"
              name="city"
               placeHolder="Ex : Le Havre"
              value=""
              minLength={2}
              maxLength={50}
            />
            <InputText
              label="Téléphone"
              type="tel"
               placeHolder="Ex : 06xxxxxxxx"
              name="phone"
              value=""
              minLength={8}
              maxLength={12}
            />

            <InputText
              label="Email"
              name="email"
               placeHolder="Ex : Pierredupont@gmail.fr"
              value=""
              minLength={5}
              maxLength={50}
            />
          </div>
        </section>
        {/* 3ème section */}
        <section className={styles.profileSection}>
          <h2 className="title">Informations</h2>
          <div className={styles.grid}>
            <div className={styles.checkboxWrapper}>
              <InputCheckbox
                label="J'ai déjà une mutuelle obligatoire"
                name="mutuelle"
              />
              <InputCheckbox
                label="Je possède un permis B en cours de validité"
                name="permisB"
              />
            </div>

            <InputText
              label="Employeur"
              name="employer"
               placeHolder="Employeur actuel principal"
              value=""
              minLength={2}
              maxLength={50}
            />

            <InputText
              label="Emploi"
              name="occupation"
               placeHolder="Poste actuel"
              value=""
              minLength={2}
              maxLength={50}
            />
            <InputText
              label="Nombre de CV de votre véhicule"
               placeHolder="Ex : 5"
              name="horsePower"
              value=""
            />
          </div>
        </section>

        <section className={styles.profileSection}>
          <h2 className="title">Documents demandés</h2>
          <div className={styles.grid4Col}>
            <InputSelect
              label="Type de fichier"
              name=""
              onChange={(e) => setSelectedFileType(e.target.value)}
            >
              <option value="diplome">Diplôme</option>
              <option value="photoDeProfil">Photo de profil</option>
            </InputSelect>
            <div>
              {selectedFileType === "diplome" && (
                <InputSelect label="Type de diplôme" name="">
                  <option value="bac">Bac</option>
                  <option value="bac+3">Bac+3</option>
                </InputSelect>
              )}
            </div>
            <div>
            {selectedFileType === "diplome" && (
            <InputText
              label="Nom de diplôme"
              name="diploma"
               placeHolder="Ex : licence sociologie"
              value=""
              minLength={2}
              maxLength={50}
            />
             )}
             </div>
            <div className={styles.profileButtons}>

              <button> + </button>
              <button> Ajouter </button>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
