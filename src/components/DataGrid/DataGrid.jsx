import { AllCommunityModule, ModuleRegistry } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react";
import { Icon } from "@iconify/react";


import styles from "./DataGrid.module.css";
import { useEffect, useState } from "react";

ModuleRegistry.registerModules([AllCommunityModule]);
const DataGrid = ({ data, colDefs, renderIconWithCondition, onActionClick, iconStyle }) => {
  const [columnDefs, setColumnDefs] = useState([]);
  // I should implement a way to add actions dynamically 
  useEffect(() => {
    let newDefs = [...colDefs];
    if (colDefs.filter((colDef) => colDef.field === "Actions").length > 0) {

      newDefs = newDefs.filter((colDef) => colDef.field !== "Actions");
      newDefs.push({
        headerName: "Actions",
        field: "Actions",
        filter: false,
        cellRenderer: (params) => (
          <div style={{ position: "relative", height: "100%" }}>
            <div className={styles.actions}  >
              <Icon
                onClick={() => onActionClick ? onActionClick(params.data) : {}}
                icon={renderIconWithCondition(params.data) || ""}
                width="1.8rem"
                style={{
                  color: iconStyle ? iconStyle(params.data).color : "inherit",
                }}
              />

            </div>
          </div>
        ),
      },)

    }
    setColumnDefs(newDefs);

  }, []);

  // Column Definitions: Defines the columns to be displayed.

  return (
    <div className={styles.customAgGrid} style={{
      height: "90%", width: "100%",
    }}>
      <AgGridReact
        datasource={data}
        columnDefs={columnDefs}
        cacheBlockSize={10}
        paginationPageSize={10}
        pagination={true}
        paginationPageSizeSelector={[10, 20, 30]}
        rowModelType="infinite"
        defaultColDef={{
          flex: 1,
          filter: true,
          sortable: true,
          resizable: true,

        }}

      />
    </div>

  );
};

export default DataGrid;
