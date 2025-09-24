import styles from "./PopupFormAddress.module.css";
import InputText from "../../ui/InputText.jsx";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { popupFormAddressSchema } from "./PopupFormAddressSchema.js";
import { DevTool } from "@hookform/devtools";
import { useNotification } from "../../../../context/notificationContext.jsx";
import notificationsHelper from "../../../helpers/notificationsHelper.js";
import addressesHelper from "../../../helpers/addressesHelper.js";

export default function PopupFormAddress({ onCreated } ) {

  const {notify}=useNotification();
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(popupFormAddressSchema),
  });
 

  


  async function onSubmit(data) {

    console.log(data);
    const response= await addressesHelper.createAddress(data);
    if (response.success) {
      reset();
      onCreated( response.data);
    } else {
      notify(response.message,"error")
    }
    // const response = await notificationsHelper.createNotification(data);
    // if (response.success) {
    //   onNotificationCreated();
    //   reset();
    // } else {
    //   notify(response.message,"error")
    // }
  }


  return (
    <div className={styles.borderPopup}>

      <form action="" onSubmit={handleSubmit(onSubmit)}>

        <section className={`${styles.grid} ${styles.popupSection}`}>

          <div className={styles.fullRow}>
            <InputText
            label="Adresse"
            placeholder="Adresse"
            {...register("address")}
            error={errors.title?.message}
          />
          </div>

          <InputText
            label="Code postal"
            placeholder="Code postal"
            {...register("postalCode")}
            error={errors.title?.message}
          />
          <InputText
            label="Ville"
            placeholder="ville"
            {...register("city")}
            error={errors.title?.message}
          />

        </section>

        <div className={styles.popupButtons}>
          <button type="submit">Créer Adresse</button>

        </div>
        <DevTool control={control} />
      </form>
    </div>
  );
}
