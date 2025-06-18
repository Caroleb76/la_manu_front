import {AllCommunityModule, ModuleRegistry} from "ag-grid-community"
import { AgGridReact } from "ag-grid-react";

import styles from "./DataGrid.module.css";

ModuleRegistry.registerModules([AllCommunityModule]);
const DataGrid = ({data,colDefs,actions}) => {
  const [columnDefs, setColumnDefs] = useState([]);
  // I should implement a way to add actions dynamically 
  useEffect(() => {
    let newDefs = [...colDefs];
    
    if(colDefs.filter((colDef) => colDef.field === "Actions").length>0){ 
      
      newDefs = newDefs.filter((colDef) => colDef.field !== "Actions");
      newDefs.push(  {
        headerName: "Actions",
        field: "Actions",
        filter: false,
        cellRenderer: (params) => (
          <div style={{ position: "relative" }}>
            <p className={styles.actions} onClick={() => console.log(params.data)}>...</p>
          </div>
        ),
      },)
      
      setColumnDefs(newDefs);
    }

  }, []);

  // Column Definitions: Defines the columns to be displayed.

  return (
<div className={styles.customAgGrid} style={{
     height: "90%", width: "100%",
      }}>
  <AgGridReact
    rowData={data}
    columnDefs={columnDefs}
    pagination={true}
    paginationPageSize={12}
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
