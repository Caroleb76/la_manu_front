import styles from "./PopupFormNotification.module.css";
import InputText from "../../ui/InputText.jsx";
import InputSelect from "../../ui/InputSelect.jsx";
import { useEffect, useState } from "react";
import usersHelper from "../../../helpers/usersHelper.js";
import rolesHelper from "../../../helpers/rolesHelper.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { popupNotificationSchema } from "./popupNotificationSchema.js";
import { DevTool } from "@hookform/devtools";
import { useNotification } from "../../../../context/notificationContext.jsx";
import notificationsHelper from "../../../helpers/notificationsHelper.js";

export default function PopupformNotification({ onNotificationCreated }) {
  const setRoles = useState([]);
  const {notify}=useNotification();
  const {
    register,
    reset,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(popupNotificationSchema),
  });
 
  const selectedStartDate=watch("startDate")



    async function onSubmit(data) {
        const response = await notificationsHelper.createNotification(data);
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
                    <InputText
                        label="Titre"
                        placeholder="Titre de la notification"
                        {...register("title")}
                        error={errors.title?.message}
                    />

                    <InputSelect
                        label="Priorité"
                        {...register("priority")}
                        error={errors.priority?.message}
                    >
                        <option value="">
                            -- Sélectionner une priorité --
                        </option>
                        <option value="1">Haute</option>
                        <option value="2">Moyenne</option>
                        <option value="3">Basse</option>
                    </InputSelect>

                    <InputText
                        label="Date de publication"
                        type="date"
                        min={convertDateToStandardString(new Date())}
                        {...register("startDate")}
                        error={errors.startDate?.message}
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
                <DevTool control={control} />
            </form>
        </div>
    );
}
