import styles from "./PopupFormSession.module.css";
import InputText from "../../ui/InputText.jsx";
import InputSelect from "../../ui/InputSelect.jsx";
import { useEffect, useState } from "react";
import sessionFormationsHelper from "../../../helpers/sessionFormationsHelper.js";
import rolesHelper from "../../../helpers/rolesHelper.js";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { popupSessionSchema } from "./popupSessionSchema.js";
import formationHelper from "../../../helpers/formationHelper.js";
import addressesHelper from "../../../helpers/addressesHelper.js";
import SearchDropDown from "../../ui/searchDropdown.jsx";
import PopupFormAddress from "../PopupFormAddress/PopupFormAddress.jsx";
import { useNotification } from "../../../../context/notificationContext.jsx";
import Combobox from "../../ui/Combobox.jsx";

export default function PopupFormSession({ onSessionCreated, session }) {
    const { notify } = useNotification();
    const [addressCreation, setAddressCreation] = useState(false);
    const [addressesOptions, setAddressesOptions] = useState([]);
    const [formations, setFormations] = useState([]);
    const [loading, setLoading] = useState(false);

    const {
        register,
        reset,
        handleSubmit,
        control,
        formState: { errors },
        watch,
    } = useForm({
        resolver: zodResolver(popupSessionSchema),
        defaultValues: {
            ...session,
            addressId: session?.Address?.id || "",
        },
    });

    const selectedStartDate = watch("startDate");

    useEffect(() => {
        loadFormations();
        loadAddresses();
        if (session) {
            reset({ ...session, addressId: session.Address.id });
            loadAddresses();
        }
    }, []);

    const loadFormations = async () => {
        const response = await formationHelper.getFormations();
        setFormations(response.data.formations);
    };

    const loadAddresses = async () => {
        const response = await addressesHelper.getAddresses();
        const dataConverted = response.data.map((address) => ({
            ...address,
            label: address.city + " - " + address.address,
        }));
        setAddressesOptions(dataConverted);
    };

    async function onSubmit(data) {
        try {
            // data.addressId will be filled by RHF Controller!
            let response;
            if (session) {
                data.id = session.id;
                response = await sessionFormationsHelper.updateSessionFormation(
                    data
                );
            } else {
                response = await sessionFormationsHelper.createSessionFormation(
                    data
                );
            }
            if (response.success) {
                notify(
                    session
                        ? "Session modifiée"
                        : "La formation a bien été ajoutée",
                    "success"
                );
                onSessionCreated();
                reset();
            } else {
                notify(response.message, "error");
            }
        } catch (e) {
            console.error(e);
        }
    }

    const onAddressCreated = (address) => {
        setAddressCreation(false);
        notify("Adresse ajoutée", "success");
        loadAddresses();
    };

    return (
        <div className={styles.borderPopup}>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <section className={`${styles.grid} ${styles.popupSection}`}>
                    <InputSelect
                        label="Formation"
                        {...register("formationId")}
                        disabled={session ? true : false}
                        error={errors.formationId?.message}
                    >
                        {session ? (
                            <option value={session.Formation.id}>
                                {session.Formation.name}
                            </option>
                        ) : (
                            <>
                                <option value="">
                                    -- Choisir une formation --
                                </option>
                                {formations?.map((formation) => (
                                    <option
                                        key={formation.id}
                                        value={formation.id}
                                    >
                                        {formation.name}
                                    </option>
                                ))}
                            </>
                        )}
                    </InputSelect>

                    <InputText
                        label="Numero de dossier"
                        disabled={session ? true : false}
                        placeholder="Numero de dossier"
                        {...register("serialNumber")}
                        error={errors.title?.message}
                    />

                    <InputText
                        label="Date de début"
                        type="date"
                        disabled={session ? true : false}
                        {...register("startDate")}
                        error={errors.startDate?.message}
                    />

                    <InputText
                        label="Date de fin"
                        type="date"
                        min={selectedStartDate}
                        {...register("endDate")}
                        error={errors.endDate?.message}
                    />

                    <Controller
                        name="addressId"
                        control={control}
                        render={({ field }) => (
                            <Combobox
                                label="Lieu"
                                options={addressesOptions}
                                loading={loading}
                                {...field}
                            />
                        )}
                    />

                    <div className={styles.flexRow}>
                        <small>
                            {addressCreation ? "Annuler" : "Nouvelle adresse"}
                        </small>
                        <button
                            className="btn-plus"
                            type="button"
                            onClick={() => setAddressCreation(!addressCreation)}
                        >
                            {addressCreation ? "-" : "+"}
                        </button>
                    </div>
                </section>
                <div className={styles.btnWrapper}>
                    {!addressCreation && (
                        <button className="btn btn-primary">
                            {" "}
                            {session ? "Modifier" : "Créer"}{" "}
                        </button>
                    )}
                </div>
            </form>
            {addressCreation && (
                <>
                    <p>Ajouter une adresse</p>

                    <PopupFormAddress onCreated={onAddressCreated} />
                </>
            )}
        </div>
    );
}
