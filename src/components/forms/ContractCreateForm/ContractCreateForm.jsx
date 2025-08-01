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
import { set } from "zod/v4-mini";

export default function ContractCreateForm({
    showPopup,
    interventions,
    deleteIntervention,
    onSelectedSession,
}) {
    const [roles, setRoles] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(0);

    const [formateurs, setFormateurs] = useState([]);
    const [sessionsFormation, setSessionsFormation] = useState([]);
    const [currentFormateurId, setCurrentFormateurId] = useState(null);
    const [currentFormateur, setCurrentFormateur] = useState(null);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [currentSession, setCurrentSession] = useState(null);
    const [contractStartDate, setContractStartDate] = useState(null);
    const [contractEndDate, setContractEndDate] = useState(null);
    const {notify}=useNotification();

    useEffect(() => {
        // aller chercher la date la plus ancienne parmi toutes les interventions
        const sortedInterventions = [...interventions].sort((a, b) => new Date(a.dateIntervention) - new Date(b.dateIntervention));
        if (sortedInterventions.length > 0) {
            setContractStartDate(sortedInterventions[0].dateIntervention);
            setContractEndDate(sortedInterventions[sortedInterventions.length - 1].dateIntervention);
        }

    }, [interventions])



    const handleChangeSession = (event) => {

        setCurrentSessionId(event.target.value);
        console.log(currentSessionId);
        
        const formationId = sessionsFormation.find(session => session.id == event.target.value)?.formationId;
        if(!formationId) {
            notify("Pas possible de trouver la formation associée a cette session", "error");
            return;
        }
        onSelectedSession(formationId);
    };
    useEffect(() => {
        const getFormateurs = async () => {
            const response = await usersHelper.getUsers({ role: "FORMATEUR" });
            if (response) {
                setFormateurs(response.data.users);
            }

            return response;
        };

        const getSessionsList = async () => {
            const response = await sessionFormationsHelper.getSessions();
            if (response) {
                setSessionsFormation(response.data.sessionFormations);
            }
            return response;
        };
        getFormateurs();
        getSessionsList();
    }, []);



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

    const {
        register,
        unregister,
        reset,
        handleSubmit,
        watch,
        control,
        formState: { errors },
        setValue,
        getValues
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
    const formateurId = watch("formateurId")

    useEffect(() => {
        // console.log("effect getUser")
        const getFormateurData = async () => {
            // console.log("the formateur id is ", formateurId);
            if (!formateurId || formateurId === "default") return
            const response = await usersHelper.getUserById(formateurId);
            if (response) {
                setCurrentFormateur(response.data);
            }

            return response;
        };
        getFormateurData();
    }, [formateurId]);

    const selectedStartDate = watch("startDate");

    useEffect(() => {
        async function loadRoles() {
            const response = await rolesHelper.getRoles();
            setRoles(response.data);
        }
        loadRoles();
    }, []);




    useEffect(() => {

        if (currentFormateur) {
            setValue("lastName", currentFormateur.lastName);
            setValue("firstName", currentFormateur.firstName);
            setValue("address", currentFormateur.address?.address);
            setValue("postalCode", currentFormateur.address?.postalCode);
            setValue("city", currentFormateur.address?.city);
        }

        if (contractStartDate) {

            


            setValue("startDate", convertDateToFranceTimeZone(contractStartDate));
        }

        if (contractEndDate) {

            setValue("endDate", convertDateToFranceTimeZone(contractEndDate));
        }


    }, [currentFormateur, currentSession, contractStartDate, contractEndDate]);

    async function onSubmit(data) {
     try {
           const { lastName, firstName, address, postalCode, city, ...otherFields } = data

        // on récupère les données du formulaire sous forme d'objet

        const formattedData = {
            interventions: interventions,
            ...otherFields
        }
        console.log("otherFields", otherFields)

        //On récupère les interventions et on les ajoute à l'objet values
        data.interventions = interventions;



        const response = await contractsHelper.createContract(formattedData);
        if (response.success) {
            console.log(response)
            reset();
           deleteIntervention(true);
           notify("Le contrat a bien été ajouté", "success");
        } else {
            alert(response.message);
        }
     } catch (error) {
        console.error(error);
        notify("Une erreur est survenue", "error");
     }
    }


    return (
        <div className={styles.borderPopup}>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.grid}>
                    <section>
                        <h2 className="title">Informations personelles</h2>
                        <div className={styles.grid}>
                            {/* TODO Compléter le menu de recherche des vacataires */}
                            <InputSelect
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
                          { currentSessionId &&  <button
                                type="button"
                                className={styles.btnPlus}
                                onClick={showPopup}
                            >
                                {" "}
                                +{" "}
                            </button>}
                        </div>
                    </section>
                </div>

                {/* <DataGrid pageSize={pageSize} colDefs={colDefs} data={getDataSource}
                />
                 */}

                <table className={styles.table}>
                    <tr>
                        <th>Numero</th>
                        <th>Module</th>
                        <th>Date</th>
                        <th>AM/PM/J</th>
                        <th>Durée</th>
                        <th>Catégorie</th>
                        <th>Supprimer</th>
                    </tr>
                    {!interventions.length && <tr><td >Aucune intervention</td></tr>}
                    {interventions.map((intervention, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{intervention.moduleName}</td>
                            <td>{convertDateToFranceTimeZone(intervention.dateIntervention)}</td>
                            <td>
                                {intervention.shift == "am"
                                    ? "Matin"
                                    : intervention.shift == "pm"
                                        ? "Après-midi"
                                        : "Journée"}
                            </td>
                            <td>{intervention.hours} heures</td>
                            <td>{intervention.interventionCategoryName}</td>
                            <td>
                                {index + 1 == interventions.length - 1 ? (
                                    ""
                                ) : (
                                    <button
                                        type="button"
                                        className="btn-sm"
                                        onClick={() => deleteIntervention(index)}
                                    >
                                        {" "}
                                        -{" "}
                                    </button>
                                )
                                }
                            </td>
                        </tr>
                    ))}
                </table>

                <div className={styles.popupButtons}>
                    <button> Créer </button>
                </div>
                <DevTool control={control} />
            </form>
        </div>
    );
}
