import DataGrid from "../../components/DataGrid/DataGrid";
import { useState, useEffect, useMemo } from "react";
import formationsHelper from "../../helpers/sessionFormationsHelper";
import Styles from "./Formations.module.css";

function Formations() {
    const colDefs = [
        { field: "Formation", filter: true },
        { field: "Numero", filter: true },
        { field: "Début", filter: true },
        { field: "Fin", filter: false },
        { field: "Lieu", filter: false },
    ];
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const getDataSource = () => ({
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
            const rows = response.data.sessionFormations.map((session) => ({
                id: session.id,
                Formation: session.Formation.name,
                Numero: session.serialNumber,
                "Début": new Date(session.startDate).toLocaleDateString(),
                "Fin": new Date(session.endDate).toLocaleDateString(),
                Lieu: session.Address.city,
            }))
            // console.log(rows, response.data.total);

            params.successCallback(rows, response.data.total);

        },
    })

    return (
        <>

            <div className={Styles.buttonContainer}>
                <button className={Styles.addButton} onClick={() =>{}}>Créer un type de formation</button>
            <button className={Styles.addButton} onClick={() =>{}}>Créer une session</button>
            </div>
            <div className={Styles.mainContainer}>

                <DataGrid colDefs={colDefs} data={getDataSource()}
                />
            </div>

        </>
    );
}

export default Formations;
