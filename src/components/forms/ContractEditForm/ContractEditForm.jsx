import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contractCreateSchema } from "./contractCreateSchema.js";
import { useNotification } from "../../../../context/notificationContext.jsx";
import contractsHelper from "../../../helpers/contractsHelper.js";
import sessionFormationsHelper from "../../../helpers/sessionFormationsHelper.js";
import usersHelper from "../../../helpers/usersHelper.js";
import rolesHelper from "../../../helpers/rolesHelper.js";
import styles from "./ContractEditForm.module.css";
import InputText from "../../ui/InputText.jsx";
import InputSelect from "../../ui/InputSelect.jsx";
import { DevTool } from "@hookform/devtools";
import { convertDateToFranceTimeZone } from "../../../utils/date.js";

export default function ContractEditForm({
    contractId,
    showPopup,
    interventions,
    deleteIntervention,
    onSelectedSession,
}) {
    const { notify } = useNotification();

    // États pour données externes utiles
    const [roles, setRoles] = useState([]);
    const [formateurs, setFormateurs] = useState([]);
    const [sessionsFormation, setSessionsFormation] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [currentInterventions, setCurrentInterventions] = useState(interventions || []);

    // React Hook Form
    const {
        register,
        reset,
        handleSubmit,
        watch,
        control,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: zodResolver(contractCreateSchema),
        defaultValues: {
            formateurId: "",
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

    // Fetch initial data pour les selects et listes
    useEffect(() => {
        async function loadData() {
            const [rolesResp, formateursResp, sessionsResp, contractResp] =
                await Promise.all([
                    rolesHelper.getRoles(),
                    usersHelper.getUsers({ role: "FORMATEUR" }),
                    sessionFormationsHelper.getSessions(),
                    contractsHelper.getContract(contractId),
                ]);

            if (rolesResp) setRoles(rolesResp.data);
            if (formateursResp) setFormateurs(formateursResp.data.users);
            if (sessionsResp)
                setSessionsFormation(sessionsResp.data.sessionFormations);

            if (contractResp) {
                // On reset le formulaire avec les données du contrat (préremplissage)
                // Assure-toi que les noms des champs correspondent à ceux du schema

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
    }, [contractId, reset]);

    // Gestion du changement session
    const handleChangeSession = (event) => {
        const selectedSessionId = event.target.value;
        setValue("sessionId", selectedSessionId);

        const formationId = sessionsFormation.find(
            (session) => session.id === selectedSessionId
        )?.formationId;

        if (!formationId) {
            notify(
                "Pas possible de trouver la formation associée à cette session",
                "error"
            );
            return;
        }
        onSelectedSession(formationId);
    };

    // Soumission du formulaire
    const onSubmit = async (data) => {
        try {
            const formattedData = {
                ...data,
                interventions: interventions,
            };
            const response = await contractsHelper.createContract(
                formattedData
            );
            if (response.success) {
                reset();
                deleteIntervention(true);
                notify("Le contrat a bien été ajouté", "success");
            } else {
                notify(
                    response.message || "Erreur lors de la création",
                    "error"
                );
            }
        } catch (error) {
            console.error(error);
            notify("Une erreur est survenue", "error");
        }
    };

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
                                disabled
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
                            disabled
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
                                    className={styles.btnPlus}
                                    onClick={showPopup}
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
                    <tr>
                        <th>Numero</th>
                        <th>Module</th>
                        <th>Date</th>
                        <th>AM/PM/J</th>
                        <th>Durée</th>
                        <th>Catégorie</th>
                        <th>Supprimer</th>
                    </tr>
                    {!currentInterventions?.length && (
                        <tr>
                            <td>Aucune intervention</td>
                        </tr>
                    )}
                    {currentInterventions &&
                        currentInterventions.map((intervention, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{intervention.ModuleFormation.name}</td>
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
                                <td>{intervention.InterventionCategory.name}</td>
                                <td>
                                    {index + 1 == interventions.length - 1 ? (
                                        ""
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn-sm"
                                            onClick={() =>
                                                deleteIntervention(index)
                                            }
                                        >
                                            {" "}
                                            -{" "}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                </table>

                <div className={styles.popupButtons}>
                    <button> Modifier </button>
                </div>
                <DevTool control={control} />
            </form>
        </div>
    );
}
