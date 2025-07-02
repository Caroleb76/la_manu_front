import styles from "./PopupFormTypeFormation.module.css";
import InputText from "../../ui/InputText.jsx";
import { useEffect, useState } from "react";
import usersHelper from "../../../helpers/usersHelper.js";
import rolesHelper from "../../../helpers/rolesHelper.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { popupFormTypeFormationSchema } from "./popupFormTypeFormationSchema.js"
import { DevTool } from "@hookform/devtools";

export default function PopupFormTypeFormation({ onTypeFormationCreated }) {
  const setRoles = useState([]);
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(popupFormTypeFormationSchema),
  });



  useEffect(() => {
    async function loadRoles() {
      const response = await rolesHelper.getRoles();
      setRoles(response.data);


    }
    loadRoles();

  }, [])


  async function onSubmit(data) {
    const response = await usersHelper.createTypeFormation(data);
    if (response.success) {
      onTypeFormationCreated();
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
            label="Contenu"
            placeholder="contenu de la formation"
            {...register("content")}
            error={errors.content?.message}
          />


        </section>


        <div className={styles.popupButtons}>
          <button> Créer </button>
        </div>
        <DevTool control={control} />
      </form>
    </div>
  );
}
