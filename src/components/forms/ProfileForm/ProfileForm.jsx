import styles from "./ProfileForm.module.css";
import InputText from "../../ui/InputText";
import InputCheckbox from "../../ui/InputCheckbox";
import InputSelect from "../../ui/InputSelect";
import { useContext, useEffect, useState, } from "react";
import { UserContext } from "../../../../context/userContext.jsx";
import { convertDateToStandardString } from "../../../utils/date.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputFile from "../../ui/InputFile"
import { handleNameInitials } from "../../../utils/initials.js";
import { useNotification } from "../../../../context/notificationContext.jsx";

import { profileSchema } from "./profileSchema"; // Make sure this path matches your project
import usersHelper from "../../../helpers/usersHelper.js";
import { set } from "zod/v4-mini";

export default function ProfileForm({ userId }) {
  const { user: currentUser, updateUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [initials, setInitials] = useState("")
  const [profilePicture, setProfilePicture] = useState(null);
  const [files, setFiles] = useState([]);
  const [user, setUser] = useState(null);
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const hasPermisB = watch("permisB")
  const { notify } = useNotification();

  useEffect(() => {
    async function loadUser() {
      let userData = null;
      if (userId) {
        const response = await usersHelper.getUserById(userId);
        userData = response.data
      } else {
        userData = currentUser
      }

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
        setUser(userData);
        const formattedInitials = handleNameInitials(userData.firstName + " " + userData.lastName)
        // console.log(formattedInitials);

        setInitials(formattedInitials)
      }
      setIsLoading(false);
    }
    loadUser();
  }, [reset]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    // console.log("Form data:", data);

    const { profilePicture, carteGrise, diplomeFile, ...userData } = data;

    formData.append("user", JSON.stringify(userData));


    files.forEach((fileObj) => {
      formData.append(fileObj.name, fileObj.file);
    });

 try {
  const response = await usersHelper.updateUser(user.id, formData);
  notify("Profil mis à jour", "success");

  const updated = response.data; 
  

  if (!userId) {
    updateUser(updated);
  }


  setUser(prev => ({ ...prev, ...updated }));
  setProfilePicture(null);
  setFiles([]);
} catch (err) {
  console.error("Update error:", err);
}
  };

  if (isLoading) return <p>Chargement...</p>;

  return (
    <div>
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <section className={`${styles.grid} ${styles.profileSection}`}>
          <div className={styles.profileIconTitleWrapper}>
            <input hidden type="file" id="avatarFile" accept=".jpg,.png,.gif,.webp" onChange={(e) => {
              console.log("photo", e.target.files[0]);
              setProfilePicture(e.target.files[0]);
              setFiles(prev => [...prev, { name: "profilePicture", file: e.target.files[0] }]);
            }} />
            <label htmlFor="avatarFile">
              <div className={styles.profileIconWrapper} >
                <div className={styles.profileIcon} >
                  {profilePicture ?
                    <img className={styles.avatarImage} src={URL.createObjectURL(profilePicture)} alt="avatar" />
                    : user.profilePicture ?
                      <img className={styles.avatarImage} src={serverUrl + user.profilePicture} alt="avatar" /> :
                      <p>{initials}</p>}
                </div>
              </div>
            </label>
            {errors.avatar && (<p className="inputError">{errors.avatar?.message}</p>)}
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
        <button type="submit" className="btn-success"> valider les modifications </button>


      </form>
    </div>
  );
}
