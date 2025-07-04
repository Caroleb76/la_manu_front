import styles from "./PopupFormTypeFormation.module.css";
import InputText from "../../ui/InputText.jsx";
import { useEffect, useState } from "react";
import usersHelper from "../../../helpers/usersHelper.js";
import rolesHelper from "../../../helpers/rolesHelper.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { popupFormTypeFormationSchema } from "./popupFormTypeFormationSchema.js"
import { DevTool } from "@hookform/devtools";
import formationHelper from "../../../helpers/formationHelper.js";
import { useNotification } from "../../../../context/notificationContext.jsx";

export default function PopupFormTypeFormation({ onFormationCreated, formation }) {
  const setRoles = useState([]);
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    values: formation,
    resolver: zodResolver(popupFormTypeFormationSchema),
  });

  const {notify}=useNotification();

  useEffect(() => {
    async function loadRoles() {
      const response = await rolesHelper.getRoles();
      setRoles(response.data);


    }
    loadRoles();

  }, [])


  async function onSubmit(data) {
    let response=null;
    if(formation){ // edit
      data.id=formation.id
      response = await formationHelper.updateFormation(data);

    }else{ // creation

      response = await formationHelper.createFormation(data);
    }
    if (response.success) {
      formation ? notify("Formation modifiée", "success"):notify("La formation a bien été ajoutée", "success");
      onFormationCreated();
      reset();
    } else {
      alert(response.message);
    }
  }


  return (
    <div className={styles.borderPopup}>

      <form action="" onSubmit={handleSubmit(onSubmit)}>

        <section className={`${styles.grid} ${styles.popupSection}`}>

          <InputText
            label="Titre"
            placeholder="Nom de la Formation"
            {...register("name")}
            error={errors.name?.message}
          />

          <InputText
            label="Description"
            placeholder="description de la formation"
            {...register("description")}
            error={errors.description?.message}
          />


        </section>


        <div className={styles.popupButtons}>
          <button> {formation ? "Modifier" : "Créer"} </button>
        </div>
        <DevTool control={control} />
      </form>
    </div>
  );
}
