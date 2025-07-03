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

export default function ContractCreateForm({ onSessionCreated }) {
    const setRoles = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [formateurs, setFormateurs] = useState(null);
    
    useEffect(() => {
        const getFormateurs = async () => {
        const response = await usersHelper.getUsers({role:"FORMATEUR"});
        if (response) {
            setFormateurs(response)
            console.log(response)
        }
        return response
    }
        const response = getFormateurs()
        
    }, [])
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
                                label="Recherche d'un vacataire">
                                <option value="">-- Sélectionner une priorité --</option>
                            </InputSelect>

                            <InputText
                                label="Nom"
                                placeholder=""
                                {...register("lastName")}
                                error={errors.lastName?.message}
                            />



                            <InputText
                                label="Prénom"
                                placeholder=""
                                {...register("firstName")}
                                error={errors.firstName?.message}
                            />

                            <InputText
                                className={styles.twoColumns}
                                label="Adresse"
                                {...register("address")}
                                error={errors.address?.message}

                            />

                            <InputText
                                label="Code postal"
                                placeholder=""
                                {...register("postalCode")}
                                error={errors.postalCode?.message}
                            />



                            <InputText
                                label="Ville"
                                placeholder=""
                                {...register("city")}
                                error={errors.city?.message}
                            />

                        </div>

                    </section>

                    <section>

                        <h2 className="title">Session de formation</h2>
                        <div className={styles.grid}>
                            {/* TODO Compléter le menu de recherche des vacataires */}
                            <InputSelect className={styles.twoColumns}
                                label="Session de formation">
                                <option value="">-- Sélectionner une priorité --</option>
                            </InputSelect>

                            <InputText
                                label="Date de début du contrat"
                                placeholder=""
                                {...register("startDate")}
                                error={errors.startDate?.message}
                            />



                            <InputText
                                label="Date de fin du contrat"
                                placeholder=""
                                {...register("endDate")}
                                error={errors.endDate?.message}
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
                        <button className={styles.btnPlus}> + </button>
                    </div>
                    <DataGrid pageSize={pageSize} colDefs={colDefs} data={getDataSource}
                    />
                </section>
                <DevTool control={control} />
            </form>
        </div>
    );
}
