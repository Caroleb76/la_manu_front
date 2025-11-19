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
import { useNotification } from "../../../../context/notificationContext.jsx";
import interventionsHelper from "../../../helpers/interventionsHelper.js";
import {
  convertDateToStandardString,
  convertDateToStandardStringPlusOne,
} from "../../../utils/date.js";
import extraCostsCategoryHelper from "../../../helpers/extraCostsCategoryHelper.js";

export default function PopupFormIntervention({
  onInterventionCreated,
  onClose,
  sessionFormation: formationId,
  interventionsCategories,
}) {
  const [extraCostsInput, setExtraCostsInput] = useState([""]);
  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);
  // const [interventionsCategories, setInterventionsCategories] = useState([]);
  const [extraCostCategories, setExtraCostCategories] = useState([]);
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
      description: "",
    },
  });

  const addExtraCosts = () => {
    setExtraCostsInput((prev) => [...prev, ""]);
  };
  const removeExtraCosts = () => {
    setExtraCostsInput((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
  };

  const onModuleChange = (e) => {
    const selectedId = e.target.value;
    const filtered = modules.filter((module) => module.id == selectedId);
    if (filtered.length <= 0) {
      return;
    }
    setValue("moduleName", filtered[0].name);
  };

  const onCategoryChange = (e) => {
    const selectedId = e.target.value;
    const filtered = interventionsCategories.filter(
      (category) => category.id == selectedId,
    );
    if (filtered.length <= 0) {
      return;
    }
    setValue("interventionCategoryName", filtered[0].name);
  };

  useEffect(() => {
    if (!formationId) return;
    const getModules = async () => {
      const response = await modulesHelper.getModuleByFormation(formationId);
      if (response) {
        setModules(response.data);
      }

      return response;
    };

    const getExtraCosts = async () => {
      const response = await extraCostsCategoryHelper.getAll();
      if (response) {
        setExtraCostCategories(response.data);
      }

      return response;
    };
    getModules();
    getExtraCosts();
  }, []);

  async function onSubmit(data) {
    onInterventionCreated(data);
    onClose();
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
            {modules?.length <= 0 ? (
              <option value="">-- Sélectionner un module --</option>
            ) : (
              <option value="" hidden>
                -- Sélectionner un module --
              </option>
            )}
            {modules?.map((module) => (
              <option key={module.id} value={module.id}>
                {module.name}
              </option>
            ))}
          </InputSelect>

          <InputText
            label="Date de l'intervention"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            {...register("dateIntervention")}
            error={errors.dateIntervention?.message}
          />

          <InputText
            label="Nombre d'heure"
            type="number"
            step="0.5"
            min="0.5"
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
            <option value="matin">matin</option>
            <option value="apres-midi">après-midi</option>
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
                <button
                  type="button"
                  onClick={addExtraCosts}
                  className="btn btn-sm"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={removeExtraCosts}
                  className="btn btn-sm"
                >
                  -
                </button>
              </div>
            </div>

            {extraCostsInput.map((input, key) => (
              <InputSelect
                key={key}
                label=""
                {...register(`extraCosts.${key}`, {
                  shouldUnregister: true,
                })}
                error={errors.extracostsState?.message}
              >
                <option value="" hidden>
                  -- Sélectionner un type de frais de déplacement --
                </option>
                {extraCostCategories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </InputSelect>
            ))}

            <input type="hidden" {...register("extraCosts")} />
          </div>
          <InputText
            {...register("description")}
            className={styles.grid_2col}
            label="Description"
            placeholder="Description"
            error={errors.description?.message}
          />

          <input type="hidden" {...register("moduleName")} />

          <input type="hidden" {...register("interventionCategoryName")} />
        </section>

        <div className={styles.popupButtons}>
          <button className="btn btn-primary"> Créer </button>
        </div>
      </form>
    </div>
  );
}
