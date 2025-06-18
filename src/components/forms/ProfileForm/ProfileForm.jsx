import styles from "./ProfileForm.module.css";
import InputText from "../../ui/InputText";
import InputCheckbox from "../../ui/InputCheckbox";
import InputSelect from "../../ui/InputSelect";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../../../context/userContext.jsx";
import { convertDateToStandardString } from "../../../utils/dates.js";

export default function ProfileForm() {

  // TODO : handle address pre-filling 
  //TODO: handle image and files

    const defaultUser = {
        gender: "",
        birthName: "",
        lastName: "",
        firstName: "",
        birthDate: "",
        birthPlace: "",
        socialSecurity: "",
        address: "",
        postalCode: "",
        city: "",
        phone: "",
        email: "",
        mutuelle: "",
        permisB: false,
        employer: "",
        occupation: "",
        horsePower: 0,
        diploma: "",
        profilePicture: "",
    };

    const { getUser } = useContext(UserContext);
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState(defaultUser);

    const handleChange = (e) => {
        setFormData((prevalue) => {
            return {
                ...prevalue,
                [e.target.name]: e.target.value,
            };
        });
    };
    async function getUserFromContext() {
        const userData = await getUser();
        console.log(user);
        if (userData) {
            setUser(userData);
            setFormData({
                ...defaultUser,
                ...userData,
                birthDate: convertDateToStandardString(
                    new Date(userData.birthDate)
                ),
            });
        }
    }
    useEffect(() => {
        const user = getUserFromContext();
        
    }, []);

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

                    <InputSelect
                        label="Civilité"
                        name="gender"
                        defaultValue="default"
                        value={formData?.gender ?? "default"}
                        onChange={handleChange}
                    >
                        <option value="madame">Madame</option>
                        <option value="monsieur">Monsieur</option>
                    </InputSelect>

                    <InputText
                        label="Nom patronymique"
                        name="lastName"
                        placeHolder="Nom de jeune fille"
                        value={formData?.birthName ?? ""}
                        minLength={2}
                        maxLength={50}
                        onChange={handleChange}
                    />
                    <InputText
                        label="Nom d'usage"
                        name="birthName"
                        placeHolder="Nom de famille"
                        value={formData?.lastName ?? ""}
                        minLength={2}
                        maxLength={50}
                        onChange={handleChange}
                    />

                    <InputText
                        label="Prénom"
                        name="firstName"
                        placeHolder="Ex : Pierre"
                        value={formData?.firstName ?? ""}
                        minLength={2}
                        maxLength={50}
                        onChange={handleChange}
                    />

                    {/*TODO default Not working */}
                    <InputText
                        label="Date de naissance"
                        type="date"
                        placeHolder="Ex : 25/03/1966"
                        name="birthDate"
                        value={formData?.birthDate ?? ""}
                        onChange={handleChange}
                    />
                    <InputText
                        label="Lieu de naissance"
                        name="birthPlace"
                        placeHolder="Ex : Le Havre"
                        value={formData?.birthPlace ?? ""}
                        minLength={2}
                        maxLength={50}
                        onChange={handleChange}
                    />

                    <InputText
                        label="Numéro de sécurité sociale"
                        name="socialSecurity"
                        placeHolder="Ex : 1591176365125 56"
                        value={formData?.socialSecurity ?? ""}
                        minLength={15}
                        maxLength={15}
                        onChange={handleChange}
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
                            value={user?.phone ?? ""}
                            minLength={8}
                            maxLength={12}
                            onChange={handleChange}
                        />

                        <InputText
                            label="Email"
                            name="email"
                            placeHolder="Ex : Pierredupont@gmail.fr"
                            value={user?.email ?? ""}
                            minLength={5}
                            maxLength={50}
                            onChange={handleChange}
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
                                checked={formData?.mutuelle ?? false}
                                onChange={handleChange}
                            />
                            <InputCheckbox
                                label="Je possède un permis B en cours de validité"
                                name="permisB"
                                checked={formData?.permisB ?? false}
                                onChange={handleChange}
                            />
                        </div>

                        <InputText
                            label="Employeur"
                            name="employer"
                            placeHolder="Employeur actuel principal"
                            value={formData?.employer ?? ""}
                            minLength={2}
                            maxLength={50}
                            onChange={handleChange}
                        />

                        <InputText
                            label="Emploi"
                            name="occupation"
                            placeHolder="Poste actuel"
                            value={formData?.occupation ?? ""}
                            minLength={2}
                            maxLength={50}
                            onChange={handleChange}
                        />
                        <InputText
                            label="Nombre de CV de votre véhicule"
                            placeHolder="Ex : 5"
                            name="horsePower"
                            value={formData?.horsePower ?? ""}
                            onChange={handleChange}
                        />
                    </div>
                </section>

                <section className={styles.profileSection}>
                    <h2 className="title">Documents demandés</h2>
                    <div className={styles.grid4Col}>
                        <InputSelect
                            label="Type de fichier"
                            name=""
                            onChange={(e) =>
                                setSelectedFileType(e.target.value)
                            }
                        >
                            <option value="diplome">Diplôme</option>
                            <option value="photoDeProfil">
                                Photo de profil
                            </option>
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
