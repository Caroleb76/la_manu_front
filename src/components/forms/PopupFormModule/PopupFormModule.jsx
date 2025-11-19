import styles from "./PopupFormModule.module.css";
import InputText from "../../ui/InputText.jsx";
import InputSelect from "../../ui/InputSelect.jsx";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { popupModuleSchema } from "./popupModuleSchema.js";
import { useNotification } from "../../../../context/notificationContext.jsx";
import formationHelper from "../../../helpers/formationHelper.js";
import modulesHelper from "../../../helpers/modulesHelper.js";

export default function PopupformModule({ onModuleCreated, module }) {
  // const setRoles = useState([]);
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
    defaultValues: {
      formationId: module?.Formation?.id ? module.Formation.id : "",
      name: module?.name,
      description: module?.description,
    },

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

  async function onSubmit(data) {
    try {
      let response = null;
      if (module) {
        // edit
        data.id = module.id;
        response = await modulesHelper.updateModule(data);
      } else {
        // creation

        response = await modulesHelper.createModule(data);
      }
      if (response.success) {
        module
          ? notify("Module modifié", "success")
          : notify("Le module a bien été ajouté", "success");
        onModuleCreated();
        reset();
      } else {
        alert(response.message);
      }
    } catch (e) {
      console.error(e);
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
            {module ? (
              <option value={module.Formation.id}>
                {module.Formation.name}
              </option>
            ) : (
              <>
                <option value="">-- Choisir une formation --</option>
                {formations?.map((formation) => (
                  <option key={formation.id} value={formation.id}>
                    {formation.name}
                  </option>
                ))}
              </>
            )}
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
          <button className="btn btn-primary">
            {" "}
            {module ? "Modifier" : "Créer"}{" "}
          </button>
        </div>
      </form>
    </div>
  );
}
