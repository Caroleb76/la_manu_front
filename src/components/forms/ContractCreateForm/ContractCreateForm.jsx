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
import DataGrid from "../../DataGrid/DataGrid.jsx";

import sessionFormationsHelper from "../../../helpers/sessionFormationsHelper.js";
import PopupFormIntervention from "../PopupFormIntervention/PopupformIntervention.jsx";

export default function ContractCreateForm({
    onSessionCreated,
    showPopup,
    interventions,
    deleteIntervention,
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

    useEffect(() => {
        // aller chercher la date la plus ancienne parmi toutes les interventions
        const sortedInterventions = [...interventions].sort((a, b) => new Date(a.dateIntervention) - new Date(b.dateIntervention));
        if (sortedInterventions.length > 0) {
            setContractStartDate(sortedInterventions[0].dateIntervention);
            setContractEndDate(sortedInterventions[sortedInterventions.length - 1].dateIntervention);
        }

    }, [interventions])

    const handleChangeFormateur = (event) => {
        setCurrentFormateurId(event.target.value);
    };
    const handleChangeSession = (event) => {
        setCurrentSessionId(event.target.value);
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
        const getFormateurData = async () => {
            const response = await usersHelper.getUserById(currentFormateurId);
            if (response) {
                setCurrentFormateur(response.data);
            }

            return response;
        };
        getFormateurData();
    }, [currentFormateurId]);

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
            setValue("startDate", new Date(contractStartDate).toLocaleDateString());
        }

        if (contractEndDate) {
            setValue("endDate", new Date(contractEndDate).toLocaleDateString());
        }


    }, [currentFormateur, currentSession, contractStartDate, contractEndDate]);

    async function onSubmit(data) {
        // on récupère les données du formulaire sous forme d'objet
        const values = getValues()
       
        //On récupère les interventions et on les ajoute à l'objet values
        values.interventions = interventions;


        // On appel la fonction onSessionCreated() qui affiche la popup de confirmation

        const response = await contractsHelper.createContract(values);
        if (response.success) {
            console.log(response)
            onSessionCreated();
            reset();
        } else {
            alert(response.message);
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
                                onChange={handleChangeFormateur}
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
                                onChange={handleChangeSession}
                                {...register("sessionId")}
                                error={errors.sessionId?.message}

                            >
                                <option value="default" disabled hidden>
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
                            <button
                                type="button"
                                className={styles.btnPlus}
                                onClick={showPopup}
                            >
                                {" "}
                                +{" "}
                            </button>
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
                            <td>{intervention.dateIntervention}</td>
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
                    <button> Valider </button>
                </div>
                <DevTool control={control} />
            </form>
        </div>
    );
}
