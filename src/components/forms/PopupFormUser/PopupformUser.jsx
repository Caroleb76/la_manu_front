import styles from "./PopupFormUser.module.css";
import InputText from "../../ui/InputText";
import InputSelect from "../../ui/InputSelect";
import { useEffect, useState } from "react";
import rolesHelper from "../../../helpers/rolesHelper";
import usersHelper from "../../../helpers/usersHelper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { popupFormUserSchema } from "./popupFormUserSchema.js"
import { DevTool } from "@hookform/devtools";

export default function PopupFormUser({ onUserCreated }) {
  const [roles, setRoles] = useState([]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(popupFormUserSchema),
  });
  useEffect(() => {
    async function loadRoles() {
      const response = await rolesHelper.getRoles();
      setRoles(response.data);


    }
    loadRoles();

  }, [])


  async function onSubmit(data) {

    const response = await usersHelper.createUser(data);
    if (response.success) {
      onUserCreated();
    } else {
      alert(response.message);
    }
  }

  return (
    <div className={styles.borderPopup}>

      <form action="" onSubmit={handleSubmit(onSubmit)}>

        <section className={`${styles.grid} ${styles.popupSection}`}>
          <InputText
            label="Nom"
            placeholder="Nom de famille"
            {...register("lastName")}
            error={errors.lastName?.message}
          />

          <InputText
            label="Prénom"
            placeholder="Ex : Pierre"
            {...register("firstName")}
            error={errors.firstName?.message}
          />

          <InputText
            label="Email"
            type="email"
            placeholder="Ex : Pierredupont@gmail.fr"
            {...register("email")}
            error={errors.email?.message}
          />

          <InputText
            label="Mot de passe"
            type="password"
            placeholder="minimum 8 caractères dont 1 maj et 1 chiffre"
            {...register("password")}
            error={errors.password?.message}
          />

          <InputSelect
            label="Rôle"
            {...register("role")}
            error={errors.role?.message}>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}

          </InputSelect>
        </section>
        <div className={styles.popupButtons}>
          <button> Créer </button>
        </div>
        <DevTool control={control} />
      </form>
    </div>
  );
}
