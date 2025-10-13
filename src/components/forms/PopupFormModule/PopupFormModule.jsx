import styles from "./PopupFormModule.module.css";
import InputText from "../../ui/InputText.jsx";
import InputSelect from "../../ui/InputSelect.jsx";
import { useEffect, useState } from "react";
import usersHelper from "../../../helpers/usersHelper.js";
import rolesHelper from "../../../helpers/rolesHelper.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { popupModuleSchema } from "./popupModuleSchema.js";
import { useNotification } from "../../../../context/notificationContext.jsx";
import formationHelper from "../../../helpers/formationHelper.js";
import {
    convertDateToStandardString,
    convertDateToStandardStringPlusOne,
} from "../../../utils/date.js";
import modulesHelper from "../../../helpers/modulesHelper.js";

export default function PopupformModule({ onNotificationCreated }) {
    const setRoles = useState([]);
    const [formations, setFormations] = useState([]);
    const { notify } = useNotification();
    const {
        register,
        reset,
        handleSubmit,
        watch,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(popupModuleSchema),
    });

    useEffect(() => {
        const fetchData = async () => {
            const response = await formationHelper.getFormations();
            if (response.success) {
                setFormations(response.data.formations);
            }
        };
        fetchData();
    }, []);

    async function onSubmit(formData) {
        const response = await modulesHelper.create(formData);
        if (response.success) {
            onNotificationCreated();
            reset();
        } else {
            notify(response.message, "error");
        }
    }

    return (
        <div className={styles.borderPopup}>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <section className={`${styles.grid} ${styles.popupSection}`}>
                    <InputSelect
                        label="Formation"
                        {...register("formationId")}
                        error={errors.formationId?.message}
                    >
                        {formations?.map((formation) => (
                            <option key={formation.id} value={formation.id}>
                                {formation.name}
                            </option>
                        ))}
                    </InputSelect>

                    <InputText
                        label="Nom"
                        placeholder="Nom du module"
                        {...register("name")}
                        error={errors.name?.message}
                    />

                    <div className={styles.twoColumns}>
                        <InputText
                            label="Description"
                            placeholder="Description du module"
                            {...register("description")}
                            error={errors.description?.message}
                        />
                    </div>
                </section>

                <div className={styles.popupButtons}>
                    <button className="btn btn-primary"> Créer </button>
                </div>
            </form>
        </div>
    );
}
