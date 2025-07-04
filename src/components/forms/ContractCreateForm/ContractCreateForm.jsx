import styles from "./ContractCreateForm.module.css";
import InputText from "../../ui/InputText.jsx";
import InputSelect from "../../ui/InputSelect.jsx";
import { useEffect, useState, useMemo } from "react";
import usersHelper from "../../../helpers/usersHelper.js";
import rolesHelper from "../../../helpers/rolesHelper.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contractCreateSchema } from "./contractCreateSchema.js"
import { DevTool } from "@hookform/devtools";
import DataGrid from "../../../components/DataGrid/DataGrid";
import contractsHelper from "../../../helpers/contractsHelper";
import sessionFormationsHelper from "../../../helpers/sessionFormationsHelper.js"

export default function ContractCreateForm({ onSessionCreated, showPopup }) {
    const setRoles = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [formateurs, setFormateurs] = useState([]);
    const [sessionsFormation, setSessionsFormation] = useState([]);
    const [currentFormateurId, setCurrentFormateurId] = useState(null);
    const [currentFormateur, setCurrentFormateur] = useState(null);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [currentSession, setCurrentSession] = useState(null);

    const handleChangeFormateur = (event) => {
        setCurrentFormateurId(event.target.value)
        console.log(event.target.value)
    }
    const handleChangeSession = (event) => {
        setCurrentSessionId(event.target.value)
        console.log(event.target.value)
    }
    useEffect(() => {
        const getFormateurs = async () => {
            const response = await usersHelper.getUsers({ role: "FORMATEUR" });
            if (response) {
                setFormateurs(response.data.users)
                // console.log(response.data.users)
            }

            return response
        }

        const getSessionsList = async () => {
            const response = await sessionFormationsHelper.getSessions();
            if (response) {
                setSessionsFormation(response.data.sessionFormations)

            }
            return response
        }
        getFormateurs()
        getSessionsList()
    }, [])

    useEffect(() => {
        const getFormateurData = async () => {
            const response = await usersHelper.getUserById(currentFormateurId);
            console.log(response)
            if (response) {
                setCurrentFormateur(response.data)
                // console.log(response.data.users)
            }

            return response

        }
        getFormateurData()
    }, [currentFormateurId])

    useEffect(() => {
        const getSessionData = async () => {
            const response = await sessionFormationsHelper.getSessionById(currentSessionId);
            console.log(response)
            if (response) {
                setCurrentSession(response.data)
                // console.log(response.data.users)
            }

            return response

        }
        getSessionData()
    }, [currentSessionId])

    const colDefs = [
        { field: "Module", filter: true },
        { field: "Date", filter: true },
        { field: "AM/PM/J", filter: false },
        { field: "Durée", filter: false },
        { field: "Catégorie", filter: false },
        { field: "Tarif horaire", filter: false },
        { field: "Montant", filter: false },
    ];
    const getDataSource = useMemo(() => ({
        getRows: async (params) => {

            const offset = params.startRow;
            const pageSize = params.endRow - params.startRow;

            const response = await contractsHelper.getContracts(offset, pageSize);

            const rows = response.data.contracts.map((contract) => {
                const hasUnvalidatedInterventions = contract?.Interventions?.some(
                    (intervention) => !intervention.validatedByAdmin || !intervention.validatedByFormateur
                );
                return {
                    id: contract.id,
                    "Nom Prénom": contract.User.firstName + " " + contract.User.lastName,
                    "Formation": contract.SessionFormation.Formation.name,
                    "Date de Début": new Date(contract.startDate).toLocaleDateString(),
                    "Date de Fin": new Date(contract.endDate).toLocaleDateString(),
                    "Heures": contract.intervention, //somme des temps des interventions
                    "Signé": contract.signed,
                    "Déclaré": contract.declared,
                    "Interventions": hasUnvalidatedInterventions,
                }
            }
            );

            // console.log(rows, response.data.total);

            params.successCallback(rows, response.data.total);

        },
    }), [reloadTrigger]);



    const {
        register,
        reset,
        handleSubmit,
        watch,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(contractCreateSchema),
        values: {
            lastName: currentFormateur ? currentFormateur.lastName : "",
            firstName: currentFormateur ? currentFormateur.firstName : "",
            address: currentFormateur ? currentFormateur.address.address : "",
            postalCode: currentFormateur ? currentFormateur.address.postalCode : "",
            city: currentFormateur ? currentFormateur.address.city : "",
            startDate: currentSession ? new Date(currentSession.startDate).toLocaleDateString() : "",
            endDate: currentSession ? new Date(currentSession.endDate).toLocaleDateString() : "",
        }
    });

    const selectedStartDate = watch("startDate")

    useEffect(() => {
        async function loadRoles() {
            const response = await rolesHelper.getRoles();
            setRoles(response.data);


        }
        loadRoles();

    }, [])


    async function onSubmit(data) {
        const response = await usersHelper.createNotification(data);
        if (response.success) {
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
                    <section >
                        <h2 className="title">Informations personelles</h2>
                        <div className={styles.grid}>
                            {/* TODO Compléter le menu de recherche des vacataires */}
                            <InputSelect className={styles.twoColumns}
                                label="Recherche d'un vacataire" onChange={handleChangeFormateur}>

                                {
                                    formateurs && formateurs.map((formateur) => (
                                        <option value={formateur.id} key={formateur.id}>{formateur.lastName} {formateur.firstName}</option>
                                    ))

                                }
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
                            <InputSelect className={styles.twoColumns}
                                label="Session de formation"
                                onChange={handleChangeSession}>
                                {sessionsFormation && sessionsFormation.map((session) => (

                                    <option value={session.id} key={session.id}> {session.Formation.name} - {session.serialNumber}</option>
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
                </div>

                <div className={styles.popupButtons}>
                    <button> Valider </button>
                </div>
                <section>
                    <div className={styles.interventionTitle}>
                        <h2 className="title">Interventions</h2>
                        <button type="button" className={styles.btnPlus} onClick={showPopup}> + </button>
                    </div>
                    <DataGrid pageSize={pageSize} colDefs={colDefs} data={getDataSource}
                    />
                </section>
                <DevTool control={control} />
            </form>
        </div>
    );
}
