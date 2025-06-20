import DataGrid from "../../components/DataGrid/DataGrid";
import { useState, useEffect, useMemo } from "react";
import formationsHelper from "../../helpers/sessionFormationsHelper";
import styles from "./Formations.module.css";

function Formations() {
    const colDefs = [
        { field: "Titre", filter: true },
        { field: "Priorité", filter: true },
        { field: "Contenu", filter: true },
        { field: "Date de début", filter: false },
        { field: "Date de fin", filter: false },
        { field: "Actions", filter: false },
    ];
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const getDataSource = useMemo(() => ({
        getRows: async (params) => {

            const offset = params.startRow;
            const pageSize = params.endRow - params.startRow;

            const response = await formationsHelper.getSessions(offset, pageSize);
            /**
             * serialNumber  String
  startDate     DateTime?
  endDate       DateTime?

  formationId   String?
  addressId     String?

  Formation     Formation? @relation(fields: [formationId], references: [id])
  Address       Address?   @relation(fields: [addressId], references: [id])
             */
            const rows = response.data.sessionFormations.map((notification) => ({
                id: notification.id,
                Formation: notification.formation.name,
                Numero: notification.serialNumber,
                "Début": new Date(notification.startDate).toLocaleDateString(),
                "Fin": new Date(notification.endDate).toLocaleDateString(),
                Lieu: notification.address.city,
            }))
            // console.log(rows, response.data.total);

            params.successCallback(rows, response.data.total);

        },
    }), [reloadTrigger]);

    return (
        <>
            <div className={styles.mainContainer}>

                <DataGrid colDefs={colDefs} data={getDataSource}
                    />
            </div>

        </>
    );
}

export default Formations;
