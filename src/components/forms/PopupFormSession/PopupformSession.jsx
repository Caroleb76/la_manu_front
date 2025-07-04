import styles from "./PopupFormSession.module.css";
import InputText from "../../ui/InputText.jsx";
import InputSelect from "../../ui/InputSelect.jsx";
import { useEffect, useState } from "react";
import sessionFormationsHelper from "../../../helpers/sessionFormationsHelper.js";
import rolesHelper from "../../../helpers/rolesHelper.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { popupSessionSchema } from "./popupSessionSchema.js"
import { DevTool } from "@hookform/devtools";
import formationHelper from "../../../helpers/formationHelper.js";
import addressesHelper from "../../../helpers/addressesHelper.js";
import SearchDropDown from "../../ui/searchDropdown.jsx";
import PopupFormAddress from "../PopupFormAddress/PopupFormAddress.jsx";
import { useNotification } from "../../../../context/notificationContext.jsx";

export default function PopupFormSession({ onSessionCreated, session }) {
  // const [session, setSession] = useState(sessionParam);
  const [addressesOptions, setAddressesOptions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressSearchText, setAddressSearchText] = useState("");
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addressCreation, setAddressCreation] = useState(false);
  const { notify } = useNotification();
  const {
    register,
    reset,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(popupSessionSchema),
    defaultValues: session || {},
  });

  const selectedStartDate = watch("startDate")

  useEffect(() => {

    loadFormations().then(() => {

      if (session) {
        reset(session);
        setAddressSearchText(session.Address.city);
        setSelectedAddress(session.Address);
      }
      console.log(formations);





    })


  }, []);


  const loadFormations = async () => {
    const response = await formationHelper.getFormations();
    setFormations(response.data);
    // console.log(response.data);

  };




  async function onSubmit(data) {
    data.addressId = selectedAddress.id

    const response = await sessionFormationsHelper.createSessionFormation(data);
    if (response.success) {
      onSessionCreated();
      reset();
    } else {
      notify(response.message, "error")
    }
  }

  const onAddressChange = async (address) => {
    try {
      setLoading(true);
      setAddressSearchText(address);
      if (address.length < 3) {
        setAddressesOptions([]);
        return
      }
      const response = await addressesHelper.getAddresses(0, 10, address);
      let dataConverted = response.data.map((address) => ({
        ...address,
        label: address.city + " - " + address.address
      }))
      setAddressesOptions(dataConverted);

    }
    finally {
      setLoading(false);
    }


  };

  const onAddressCreated = (address) => {
    console.log(address);

    setAddressCreation(false);
    onAddressChange(address.city);
    notify("Adresse ajoutée", "success")
  }

  return (
    <div className={styles.borderPopup}>

      <form action="" onSubmit={handleSubmit(onSubmit)}>

        <section className={`${styles.grid} ${styles.popupSection}`}>


          <InputSelect label="Formation"
            {...register("formationId")}
            disabled={session ? true : false}
            error={errors.formationId?.message}>
            {
              session ? (

                <option value={session.Formation.id}>{session.Formation.name}</option>
              ) : (
                <>
                  <option value="">-- Choisir une formation --</option>
                  {formations?.map((formation) => (
                    <option key={formation.id} value={formation.id}>
                      {formation.name}
                    </option>
                  ))}

                </>
              )
            }
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
            label="Date d'expiration"
            type="date"
            min={selectedStartDate}
            {...register("endDate")}
            error={errors.endDate?.message}

          />
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>

            <SearchDropDown label="Lieu" name="addressId"
              options={addressesOptions}
              //asd
              onChangeParam={(e) => { onAddressChange(e.target.value) }}
              valueField={"label"}
              onSelect={(a) => {
                console.log(a);
                setSelectedAddress(a);

                setAddressSearchText(a.city);
                setAddressesOptions([])
              }}
              loading={loading}
              value={addressSearchText}
              {...register("addressId")} />


            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexDirection: "column" }}>
              <small style={{ fontSize: "0.7rem", width: "100%", textAlign: "center" }}>
                {addressCreation ? "Annuler" : "Nouvelle adresse"}
              </small>
              <button
                style={{ width: "3rem", height: "2rem", padding: "0", margin: "0", flex: "1" }}
                type="button"
                onClick={() => setAddressCreation(!addressCreation)}
              >{addressCreation ? "-" : "+"}</button>
            </div>
          </div>

        </section>
        <div className={styles.popupButtons}>
          {!addressCreation && (
            <button> {session ? "Modifier" : "Créer"} </button>
          )}
        </div>
        <DevTool control={control} />
      </form>
      {addressCreation && (
        <>
          <p style={{ textAlign: "center", color: "var(--primary-color)" }}>Ajouter une adresse</p>

          <PopupFormAddress onCreated={onAddressCreated} />
        </>
      )}
    </div>
  );
}
