import styles from "./ProfileForm.module.css";
import InputText from "../../ui/InputText";
import InputCheckbox from "../../ui/InputCheckbox";
import InputSelect from "../../ui/InputSelect";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/userContext.jsx";
import { convertDateToStandardString } from "../../../utils/dates.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import { profileSchema } from "./profileSchema"; // Make sure this path matches your project

export default function ProfileForm() {
  const { getUser } = useContext(UserContext);
  const [selectedFileType, setSelectedFileType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    async function loadUser() {
      const userData = await getUser();
      console.log(userData)
      if (userData) {
        reset({
          ...userData,
          birthDate: convertDateToStandardString(new Date(userData.birthDate)),
          address: userData.address.address,
          postalCode: userData.address.postalCode,
          city: userData.address.city,
          profilePicture: "",
          diploma: "",
        });
      }
      setIsLoading(false);
    }
    loadUser();
  }, [getUser, reset]);

  if (isLoading) return <p>Chargement...</p>;

  return (
    <div>
      <form onSubmit={handleSubmit((data) => console.log(data))}>
        <section className={`${styles.grid} ${styles.profileSection}`}>
          <div className={styles.profileIconTitleWrapper}>
            <div className={styles.profileIconWrapper}>
              <div className={styles.profileIcon}>
                <p>AB</p>
              </div>
            </div>
            <h2 className="title">Etat civil</h2>
          </div>

          <InputSelect label="Civilité" {...register("gender")} error={errors.gender?.message}> 
            <option value="madame">Madame</option>
            <option value="monsieur">Monsieur</option>
          </InputSelect>

          <InputText label="Nom patronymique" {...register("birthName")} error={errors.birthName?.message} />
          <InputText label="Nom d'usage" {...register("lastName")} error={errors.lastName?.message} />
          <InputText label="Prénom" {...register("firstName")} error={errors.firstName?.message} />
          <InputText label="Date de naissance" type="date" {...register("birthDate")} error={errors.birthDate?.message} />
          <InputText label="Lieu de naissance" {...register("birthPlace")} error={errors.birthPlace?.message} />
          <InputText label="Numéro de sécurité sociale" {...register("socialSecurity")} error={errors.socialSecurity?.message} />
        </section>

        <section className={styles.profileSection}>
          <h2 className="title">Coordonnées</h2>
          <div className={styles.grid}>
            <InputText label="Adresse" {...register("address")} error={errors.address?.message} />
            <InputText label="Code postal" {...register("postalCode")} error={errors.postalCode?.message} />
            <InputText label="Ville" {...register("city")} error={errors.city?.message} />
            <InputText label="Téléphone" {...register("phone")} error={errors.phone?.message} />
            <InputText label="Email" {...register("email")} error={errors.email?.message} />
          </div>
        </section>

        <section className={styles.profileSection}>
          <h2 className="title">Informations</h2>
          <div className={styles.grid}>
            <div className={styles.checkboxWrapper}>
              <InputCheckbox label="J'ai déjà une mutuelle obligatoire" {...register("mutuelle")} />
              <InputCheckbox label="Je possède un permis B en cours de validité" {...register("permisB")} />
            </div>
            <InputText label="Employeur" {...register("employer")} error={errors.employer?.message} />
            <InputText label="Emploi" {...register("occupation")} error={errors.occupation?.message} />
            <InputText label="Nombre de CV de votre véhicule" {...register("horsePower")} error={errors.horsePower?.message} />
          </div>
        </section>

        <section className={styles.profileSection}>
          <h2 className="title">Documents demandés</h2>
          <div className={styles.grid4Col}>
            <InputSelect label="Type de fichier" onChange={(e) => setSelectedFileType(e.target.value)}>
              <option value="diplome">Diplôme</option>
              <option value="photoDeProfil">Photo de profil</option>
            </InputSelect>

            {selectedFileType === "diplome" && (
              <>
                <InputSelect label="Type de diplôme" {...register("diplomaType")} error={errors.diplomaType?.message}> 
                  <option value="bac">Bac</option>
                  <option value="bac+3">Bac+3</option>
                </InputSelect>
                <InputText label="Nom de diplôme" {...register("diploma")} error={errors.diploma?.message} />
              </>
            )}

            <div className={styles.profileButtons}>
              <button type="button"> + </button>
              <button type="submit"> Ajouter </button>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
