import {AllCommunityModule, ModuleRegistry} from "ag-grid-community"
import { AgGridReact } from "ag-grid-react";

import styles from "./DataGrid.module.css";

ModuleRegistry.registerModules([AllCommunityModule]);
const DataGrid = ({data,colDefs}) => {
 


  // Column Definitions: Defines the columns to be displayed.

  return (
<div className={styles.customAgGrid} style={{
     height: 500, width: "100%",
      }}>
  <AgGridReact
    rowData={data}
    columnDefs={colDefs}
    pagination={true}
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
