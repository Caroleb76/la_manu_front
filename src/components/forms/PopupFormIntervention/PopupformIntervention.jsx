import styles from "./PopupFormIntervention.module.css";
import InputText from "../../ui/InputText.jsx";
import InputSelect from "../../ui/InputSelect.jsx";
import { useEffect, useState } from "react";
import usersHelper from "../../../helpers/usersHelper.js";
import modulesHelper from "../../../helpers/modulesHelper.js";
import extraCostsHelper from "../../../helpers/extraCostsHelper.js";
import interventionsCategoriesHelper from "../../../helpers/interventionsCategoriesHelper.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { popupInterventionSchema } from "./popupInterventionSchema.js";
import { DevTool } from "@hookform/devtools";
import { useNotification } from "../../../../context/notificationContext.jsx";
import interventionsHelper from "../../../helpers/interventionsHelper.js";
import { convertDateToStandardString, convertDateToStandardStringPlusOne } from "../../../utils/date.js";

export default function PopupFormIntervention({ onInterventionCreated, onClose }) {
    const [extraCostsInput, setExtraCostsInput] = useState([""]);
    const [roles, setRoles] = useState([]);
    const [modules, setModules] = useState([]);
    const [interventionsCategories, setInterventionsCategories] = useState([]);
    const [extraCostsOptions, setExtraCostsOptions] = useState([]);
    const { notify } = useNotification();
    const {
        register,
        reset,
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(popupInterventionSchema),
        defaultValues: {
            moduleId: "",
            moduleName: "",
            interventionCategoryId: "",
            interventionCategoryName: "",
            shift: "",
            extraCost: [],

        }
    });

    const addExtraCosts = () => {
        setExtraCostsInput(prev => [...prev, ""])
    }
    const removeExtraCosts = () => {
        setExtraCostsInput(prev => prev.length > 0 ? prev.slice(0, -1) : prev)
    }

    const selectedModuleId = watch("moduleId")
    const onModuleChange = (e) => {
        const filtered = modules.filter((module) => module.id == selectedModuleId)
        if (filtered.length <= 0) {
            return
        }
        setValue("moduleName", filtered[0].name)
    }

    const selectedCategoryId = watch("interventionCategoryId")
    const onCategoryChange = (e) => {
        console.log("categoryChange")
        const selected=e.target.value

         console.log("selected", selected)
        const filtered = interventionsCategories.filter((category) => category.id == selectedCategoryId)
        if (filtered.length <= 0) {
            return
        }
        console.log(filtered[0].name)
        setValue("interventionCategoryName", filtered[0].name)
    }

    useEffect(() => {
        const getModules = async () => {
            const response = await modulesHelper.getModules();
            if (response) {
                //  console.log(response.data)
                setModules(response.data)
                // console.log(response.data.users)
            }

            return response
        }

        const getCategories = async () => {
            const response = await interventionsCategoriesHelper.getInterventionsCategories();
            if (response) {
                setInterventionsCategories(response.data)
                console.log(response.data)
            }
            return response
        }
        const getExtraCosts = async () => {
            const response = await extraCostsHelper.getExtraCosts();
            if (response) {
                console.log("extracostsResponse", response.data)
                setExtraCostsOptions(response.data)
                // console.log(response.data.users)
            }

            return response
        }
        getModules()
        getCategories()
        getExtraCosts()
    }, [])



    useEffect(() => {
        console.log("errors", errors)
    }, [errors])
    async function onSubmit(data) {
        console.log("submit", data)


        onInterventionCreated(data)
        onClose()
        // const response = await interventionsHelper.createIntervention(data);
        // if (response.success) {
        //     onInterventionCreated();
        //     reset();
        // } else {
        //     notify(response.message, "error");
        // }
    }




    return (
        <div className={styles.borderPopup}>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <section className={`${styles.grid} ${styles.popupSection}`}>


                    <InputSelect
                        label="Module"
                        {...register("moduleId")}
                        error={errors.moduleId?.message}
                        onChange={onModuleChange}
                    >
                        <option value="" hidden>
                            -- Sélectionner un module --
                        </option>
                        {modules?.map((module) => (
                            <option key={module.id} value={module.id}
                            >
                                {module.name}
                            </option>
                        ))}
                    </InputSelect>

                    <InputText
                        label="Date de l'intervention"
                        type="date"
                        {...register("dateIntervention")}
                        error={errors.dateIntervention?.message}
                    />

                    <InputText
                        label="Nombre d'heure"
                        type="number"
                        step="0.5"
                        {...register("hours")}
                        error={errors.hours?.message}
                    />

                    <InputSelect
                        label="matin/après-midi/journée"
                        {...register("shift")}
                        error={errors.shift?.message}
                    >
                        <option value="" hidden>
                            -- Sélectionner une option --
                        </option>
                        <option value="am">matin</option>
                        <option value="pm">après-midi</option>
                        <option value="journee">journée</option>
                    </InputSelect>


                    <InputSelect
                        label="Catégorie d'intervention"
                        {...register("interventionCategoryId")}
                        error={errors.interventionCategoryId?.message}
                         onChange={onCategoryChange}
                    >
                        <option value="" hidden>
                            -- Sélectionner une catégorie --
                        </option>
                        {interventionsCategories?.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </InputSelect>

                    <div className={styles.grid_2col}>
                        <div className={styles.extraCostsTitle}>
                            <h2>Frais de déplacement</h2>
                            <div className={styles.extraCostsButtons}>
                                <button type="button" onClick={addExtraCosts} className="btn btn-sm">
                                    +
                                </button>
                                <button type="button" onClick={removeExtraCosts} className="btn btn-sm">
                                    -
                                </button>
                            </div>
                        </div>

                        {extraCostsInput.map((input, key) => (<InputSelect
                            key={key}
                            label=""
                            {...register(`extraCosts.${key}`, { shouldUnregister: true })}

                            error={errors.extracostsState?.message}
                        >
                            <option value="" hidden>
                                -- Sélectionner un type de frais de déplacement --
                            </option>
                            {extraCostsOptions?.map((cost) => (
                                <option key={cost.id} value={JSON.stringify({
                                    label: cost.category,
                                    id: cost.id
                                })}>
                                    {cost.category}
                                </option>
                            ))}
                        </InputSelect>))}

                        <input type="hidden" {...register("extraCosts")} />

                    </div >
                    <InputText
                        className={styles.grid_2col}
                        label="Description"
                        placeholder="Description"
                        {...register("description")}
                        error={errors.description?.message}
                    />

                    <input type="hidden"
                        {...register("moduleName")}
                    />

                    <input type="hidden"
                        {...register("interventionCategoryName")}
                    />
                </section>


                <div className={styles.popupButtons}>
                    <button className="btn "> Créer </button>
                </div>
                <DevTool control={control} />
            </form>
        </div>
    );
}
