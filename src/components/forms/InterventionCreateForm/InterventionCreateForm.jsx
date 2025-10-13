import styles from "./PopupFormNotification.module.css";
import InputText from "../../ui/InputText.jsx";
import InputSelect from "../../ui/InputSelect.jsx";
import InputCheckbox from "../../ui/InputCheckbox.jsx";
import { useEffect, useState } from "react";
import usersHelper from "../../../helpers/usersHelper.js";
import rolesHelper from "../../../helpers/rolesHelper.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { interventionCreateSchema } from "./interventionCreateSchema.js";
import { useNotification } from "../../../../context/notificationContext.jsx";
import interventionsHelper from "../../../helpers/interventionsHelper.js";
import {
    convertDateToStandardString,
    convertDateToStandardStringPlusOne,
} from "../../../utils/date.js";

export default function InterventionCreateForm({ onInterventionCreated }) {
    const setRoles = useState([]);
    const { notify } = useNotification();
    const {
        register,
        reset,
        handleSubmit,
        watch,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(interventionCreateSchema),
    });

    const selectedStartDate = watch("startDate");

    async function onSubmit(data) {
        const response = await interventionsHelper.createIntervention(data);
        if (response.success) {
            onInterventionCreated();
            reset();
        } else {
            notify(response.message, "error");
        }
    }

    return (
        <div className={styles.borderPopup}>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <section className={`${styles.grid} ${styles.popupSection}`}>
                    <InputText
                        label="Date d'intervention"
                        type="date"
                        min={convertDateToStandardString(new Date())}
                        {...register("dateIntervention")}
                        error={errors.dateIntervention?.message}
                    />
                    <InputText
                        label="Durée"
                        type="number"
                        step="0.5"
                        {...register("hours")}
                        error={errors.hours?.message}
                    />

                    <InputSelect
                        label="AM/PM/J"
                        {...register("shift")}
                        error={errors.shift?.message}
                    >
                        <option value="">-- Sélectionner --</option>
                        <option value="am">Matin</option>
                        <option value="pm">Après-midi</option>
                        <option value="j">Journée</option>
                    </InputSelect>

                    <InputText
                        label="Description"
                        placeholder="Description de l'intervention"
                        {...register("description")}
                        error={errors.description?.message}
                    />
                    <InputCheckbox
                        label=""
                        {...register("validatedByAdmin")}
                        hidden
                    />
                    <InputCheckbox
                        label=""
                        {...register("validatedByFormateur")}
                        hidden
                    />

                    <InputText
                        label="Date d'expiration"
                        type="date"
                        min={
                            selectedStartDate
                                ? convertDateToStandardStringPlusOne(
                                      new Date(selectedStartDate)
                                  )
                                : convertDateToStandardStringPlusOne(new Date())
                        }
                        {...register("endDate")}
                        error={errors.endDate?.message}
                    />
                </section>
                <InputText
                    label="Contenu"
                    placeholder="contenu de la notification"
                    {...register("content")}
                    error={errors.content?.message}
                />

                <div className={styles.popupButtons}>
                    <button> Créer </button>
                </div>
            </form>
        </div>
    );
}
