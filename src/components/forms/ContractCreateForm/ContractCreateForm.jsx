import styles from "./ContractCreateForm.module.css";
import InputText from "../../ui/InputText.jsx";
import InputSelect from "../../ui/InputSelect.jsx";
import { useEffect, useState } from "react";
import usersHelper from "../../../helpers/usersHelper.js";
import rolesHelper from "../../../helpers/rolesHelper.js";
import contractsHelper from "../../../helpers/contractsHelper.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contractCreateSchema } from "./contractCreateSchema.js";
import { DevTool } from "@hookform/devtools";
import sessionFormationsHelper from "../../../helpers/sessionFormationsHelper.js";
import { convertDateToFranceTimeZone } from "../../../utils/date.js";
import { useNotification } from "../../../../context/notificationContext.jsx";
import { useNavigate } from "react-router";
import { set } from "zod/v4-mini";

export default function ContractCreateForm({
    userRole,
    contractId,
    showPopup,
    interventions,
    deleteIntervention,
    onSelectedSession,
    interventionsCategories
}) {
    const { notify } = useNotification();
    const navigate = useNavigate();

    //Setup React Hook Form
    const {
        register,
        unregister,
        reset,
        handleSubmit,
        watch,
        control,
        formState: { errors },
        setValue,
        getValues,
    } = useForm({
        resolver: zodResolver(contractCreateSchema),
        defaultValues: {
            lastName: "",
            firstName: "",
            address: "",
            postalCode: "",
            city: "",
            sessionId: "",
            startDate: "",
            endDate: "",
        },
    });

    // States
    const [roles, setRoles] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [formateurs, setFormateurs] = useState([]);
    const [sessionsFormation, setSessionsFormation] = useState([]);
    const [currentFormateurId, setCurrentFormateurId] = useState(null);
    const [currentFormateur, setCurrentFormateur] = useState(null);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [currentInterventions, setCurrentInterventions] = useState([]);
    const [currentSession, setCurrentSession] = useState(null);
    const [contractStartDate, setContractStartDate] = useState(null);
    const [contractEndDate, setContractEndDate] = useState(null);
    const [currentContract, setCurrentContract] = useState(null);
    
    const [isSigned, setIsSigned] = useState(false);
    const formateurId = watch("formateurId");
    const selectedStartDate = watch("startDate");

    //UseEffects
    // On mount
    useEffect(() => {
        // Get the list of formateurs
        const getFormateurs = async () => {
            const response = await usersHelper.getUsers({ role: "FORMATEUR" });
            if (response) {
                setFormateurs(response.data.users);
            }

            return response;
        };

        // Get the list of sessions
        const getSessionsList = async () => {
            const response = await sessionFormationsHelper.getSessions();
            if (response) {
                setSessionsFormation(response.data.sessionFormations);
            }
            return response;
        };

        // Get the list of roles
        const getRoles = async () => {
            const response = await rolesHelper.getRoles();
            setRoles(response.data);
        };

        

        getFormateurs();
        getSessionsList();
        getRoles();

    }, []);



    useEffect(() => {
        if (interventions && interventions.length > 0) {
            setCurrentInterventions(interventions);
            //Récupérer la date  de l'intervention la plus tôt

            const oldestIntervention =interventions.reduce((oldest, current) =>
                current.dateIntervention < oldest.dateIntervention ? current : oldest
            );

            setContractStartDate(oldestIntervention.dateIntervention);

            //Récupérer la date  de l'intervention la plus tard

            const latestIntervention =interventions.reduce((latest, current) =>
                current.dateIntervention > latest.dateIntervention ? current : latest
            );
            setContractEndDate(latestIntervention.dateIntervention);
        } else if (interventions && interventions.length === 0) {
            setCurrentInterventions([]);
        }
    }, [interventions]);

    // On update
    useEffect(() => {
        async function loadData() {
            if (!contractId) return;
            const contractResp = await contractsHelper.getContract(contractId);

            if (contractResp) {
                // On reset le formulaire avec les données du contrat (préremplissage)
                // Assure-toi que les noms des champs correspondent à ceux du schema
                setCurrentContract(contractResp.data);
                setIsSigned(contractResp.data.signed);

                reset({
                    formateurId: contractResp.data.User.id || "",
                    lastName: contractResp.data.User.lastName || "",
                    firstName: contractResp.data.User.firstName || "",
                    address: contractResp.data.User.address.address || "",
                    postalCode: contractResp.data.User.address.postalCode || "",
                    city: contractResp.data.User.address.city || "",
                    sessionId: contractResp.data.sessionFormationId || "",
                    startDate:
                        convertDateToFranceTimeZone(
                            contractResp.data.startDate
                        ) || "",
                    endDate:
                        convertDateToFranceTimeZone(
                            contractResp.data.endDate
                        ) || "",
                    // inclure d'autres champs si nécessaire
                });

                setCurrentInterventions(contractResp.data.interventions);
                setCurrentSessionId(contractResp.data.sessionFormationId);
            }
        }
        loadData();
    }, [contractId, reset, isSigned]);

    // On current session update
    useEffect(() => {
        const getSessionData = async () => {
            const response = await sessionFormationsHelper.getSessionById(
                currentSessionId
            );
            if (response) {
                setCurrentSession(response.data);
            }

            return response;
        };
        getSessionData();
    }, [currentSessionId]);

    // On formateur update
    useEffect(() => {
        const getFormateurData = async () => {
            if (!formateurId || formateurId === "default") return;
            const response = await usersHelper.getUserById(formateurId);
            if (response) {
                setCurrentFormateur(response.data);
            }

            return response;
        };
        getFormateurData();
    }, [formateurId]);

    useEffect(() => {
        if (currentFormateur) {
            setValue("lastName", currentFormateur.lastName);
            setValue("firstName", currentFormateur.firstName);
            setValue("address", currentFormateur.address?.address);
            setValue("postalCode", currentFormateur.address?.postalCode);
            setValue("city", currentFormateur.address?.city);
        }

        if (contractStartDate) {
            setValue(
                "startDate",
                convertDateToFranceTimeZone(contractStartDate)
            );
        }

        if (contractEndDate) {
            setValue("endDate", convertDateToFranceTimeZone(contractEndDate));
        }
    }, [
        currentFormateur,
        currentSession,
        contractStartDate,
        contractEndDate,
        setValue,
    ]);

    //Function: handle change session
    const handleChangeSession = (event) => {
        setCurrentSessionId(event.target.value);

        const formationId = sessionsFormation.find(
            (session) => session.id == event.target.value
        )?.formationId;
        if (!formationId) {
            notify(
                "Pas possible de trouver la formation associée a cette session",
                "error"
            );
            return;
        }
        onSelectedSession(formationId);
    };

    function extractData(data) {
        try {
            const {
                lastName,
                firstName,
                address,
                postalCode,
                city,
                ...otherFields
            } = data;

            // on récupère les données du formulaire sous forme d'objet
            const formattedData = {
                interventions: interventions,
                ...otherFields,
            };

            //On récupère les interventions et on les ajoute à l'objet values
            data.interventions = interventions;

            return formattedData;
        } catch (error) {
            console.error(error);
        }
    }
    // Function  : Form submit

    async function onCreate(data) {
        try {
            const formattedData = extractData(data);
            const response = await contractsHelper.createContract(
                formattedData
            );
            if (response.success) {
                reset();
                deleteIntervention(true);
                notify("Le contrat a bien été ajouté", "success");
                navigate("/dashboard/contracts");
            } else {
                alert(response.message);
            }
        } catch (error) {
            console.error(error);
            notify("Une erreur est survenue", "error");
        }
        return;
    }
    async function onEdit(data) {
        try {
            const formattedData = extractData(data);
            const response = await contractsHelper.editContract(formattedData);
            if (response.success) {
                reset();
                deleteIntervention(true);
                notify("Le contrat a bien été modifié", "success");
            } else {
                alert(response.message);
            }
        } catch (error) {
            console.error(error);
            notify("Une erreur est survenue", "error");
        }
        return;
    }
    async function onSign(data) {
        try {
            const response = await contractsHelper.signContract(contractId);
            if (response.success) {
                setIsSigned(true);
                deleteIntervention(true);
                notify("Le contrat a bien été signé", "success");
            } else {
                alert(response.message);
            }
        } catch (error) {
            console.error(error);
            notify("Une erreur est survenue", "error");
        }

        return;
    
    }

    function getRateFromInterventionCategoryId(interventionCategoryId) {
        const rate = interventionsCategories.find(
            (category) => category.id == interventionCategoryId
        )?.rate;
        return rate;
      
    }

    return (
        //DEBUG
        <div className={styles.borderPopup}>

            {currentInterventions.length > 0 && (
                <div className={styles.interventionsContainer}>
                    <h2 className="title">Interventions</h2>
                    <div className={styles.interventions}>
                        {interventions.map((intervention, index) => (
                            <div className={styles.intervention} key={index}>
                                <h3>{intervention.title}</h3>
                                <p>{intervention.date}</p>
                                <p>{intervention.hours}h</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <form action="">
                <div className={styles.grid}>
                    <section>
                        <h2 className="title">Informations personelles</h2>

                        <div className={styles.grid}>
                            {/* TODO Compléter le menu de recherche des vacataires */}
                            <InputSelect
                                disabled={userRole.name == "FORMATEUR"}
                                className={styles.twoColumns}
                                label="Recherche d'un vacataire"
                                {...register("formateurId")}
                                error={errors.formateurId?.message}
                            >
                                <option value="default" disabled hidden>
                                    Sélectionner
                                </option>
                                {formateurs &&
                                    formateurs.map((formateur) => (
                                        <option
                                            value={formateur.id}
                                            key={formateur.id}
                                        >
                                            {formateur.lastName}{" "}
                                            {formateur.firstName}
                                        </option>
                                    ))}
                            </InputSelect>

                            <InputText
                                label="Nom"
                                placeholder=""
                                {...register("lastName")}
                                error={errors.lastName?.message}
                                disabled
                            />

                            <InputText
                                label="Prénom"
                                placeholder=""
                                {...register("firstName")}
                                error={errors.firstName?.message}
                                disabled
                            />

                            <InputText
                                className={styles.twoColumns}
                                label="Adresse"
                                {...register("address")}
                                error={errors.address?.message}
                                disabled
                            />

                            <InputText
                                label="Code postal"
                                placeholder=""
                                {...register("postalCode")}
                                error={errors.postalCode?.message}
                                disabled
                            />

                            <InputText
                                label="Ville"
                                placeholder=""
                                {...register("city")}
                                error={errors.city?.message}
                                disabled
                            />
                        </div>
                    </section>

                    <section>
                        <h2 className="title">Session de formation</h2>
                        <div className={styles.grid}>
                            {/* TODO Compléter le menu de recherche des vacataires */}
                            <InputSelect
                                disabled={userRole.name == "FORMATEUR"}
                                className={styles.twoColumns}
                                label="Session de formation"
                                {...register("sessionId")}
                                onChange={handleChangeSession}
                                error={errors.sessionId?.message}
                            >
                                <option value="" disabled hidden>
                                    Sélectionner
                                </option>
                                {sessionsFormation &&
                                    sessionsFormation.map((session) => (
                                        <option
                                            value={session.id}
                                            key={session.id}
                                        >
                                            {" "}
                                            {session.Formation.name} -{" "}
                                            {session.serialNumber}
                                        </option>
                                    ))}
                            </InputSelect>

                            <InputText
                                label="Date de début du contrat"
                                placeholder=""
                                {...register("startDate")}
                                error={errors.startDate?.message}
                                disabled
                            />

                            <InputText
                                label="Date de fin du contrat"
                                placeholder=""
                                {...register("endDate")}
                                error={errors.endDate?.message}
                                disabled
                            />

                            {/* <InputText
                        label="Nombre d'heures total du contrat"
                        {...register("")}
                        // error={errors.address?.message}

                    /> */}
                        </div>
                    </section>
                    <section className={styles.twoColumns}>
                        <div className={styles.interventionTitle}>
                            <h2 className="title">Interventions</h2>
                            {currentSessionId && (
                                <button
                                    type="button"
                                    className="btn-plus"
                                    onClick={showPopup}
                                    disabled={
                                        userRole.name == "FORMATEUR" || isSigned
                                    }
                                >
                                    {" "}
                                    +{" "}
                                </button>
                            )}
                        </div>
                    </section>
                </div>

                {/* <DataGrid pageSize={pageSize} colDefs={colDefs} data={getDataSource}
                />
                 */}

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Numero</th>
                            <th>Module</th>
                            <th>Date</th>
                            <th>AM/PM/J</th>
                            <th>Durée</th>
                            <th>Catégorie</th>
                            <th>Tarif</th>
                            <th>Supprimer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!currentInterventions?.length && (
                            <tr>
                                <td>Aucune intervention</td>
                            </tr>
                        )}
                        {currentInterventions &&
                            currentInterventions.map((intervention, index) => (
                                <tr key={index} >
                                    <td>{index + 1}</td>
                                    <td>{intervention.ModuleFormation?.name ?? "N/A"}</td>
                                    <td>
                                        {convertDateToFranceTimeZone(
                                            intervention.dateIntervention
                                        )}
                                    </td>
                                    <td>
                                        {intervention.shift == "am"
                                            ? "Matin"
                                            : intervention.shift == "pm"
                                            ? "Après-midi"
                                            : "Journée"}
                                    </td>
                                    <td>{intervention.hours} heures</td>
                                    <td>
                                        {intervention.InterventionCategory?.name ?? "N/A"}
                                    </td>
                                    <td>
                                        {intervention.InterventionCategory?.id? getRateFromInterventionCategoryId(intervention.InterventionCategory?.id) + "€"  : "N/A"}
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn-plus"
                                            disabled={
                                                userRole.name == "FORMATEUR" ||
                                                isSigned
                                            }
                                            onClick={() =>
                                                deleteIntervention(index)
                                            }
                                        >
                                            {" "}
                                            -{" "}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                <div className={styles.popupButtons}>
                    {contractId && (
                        <h3
                            className={
                                isSigned ? styles.isSigned : styles.isNotSigned
                            }
                        >
                            {isSigned
                                ? "Contrat déjà signé"
                                : "Contrat à signer"}
                        </h3>
                    )}
                    {!contractId && userRole.name == "ADMIN" && (
                        <button onClick={handleSubmit(onCreate)} className="btn btn-primary"> Créer</button>
                    )}
                    {contractId && userRole.name == "ADMIN" && (
                        <button
                            onClick={handleSubmit(onEdit)}
                            disabled={isSigned}
                        >
                            {" "}
                            Modifier
                        </button>
                    )}
                    {userRole.name == "FORMATEUR" && (
                        <button
                            onClick={handleSubmit(onSign)}
                            disabled={isSigned}
                        >
                            {" "}
                            Signer{" "}
                        </button>
                    )}
                </div>

                <DevTool control={control} />
            </form>
        </div>
    );
}
