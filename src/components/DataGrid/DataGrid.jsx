// DataGrid.jsx
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Icon } from "@iconify/react";
import styles from "./DataGrid.module.css";
import { useEffect, useRef, useState } from "react";

ModuleRegistry.registerModules([AllCommunityModule]);

const DataGrid = ({
  rowData,
  colDefs,
  renderIconWithCondition,
  onActionClick,
  iconStyle,
  pageSize = 10,
}) => {
  const [columnDefs, setColumnDefs] = useState([]);

  useEffect(() => {
    let newDefs = [...colDefs];
    if (colDefs.some((c) => c.field === "Actions")) {
      const actionsCol = colDefs.find((c) => c.field === "Actions");
      newDefs = newDefs.filter((c) => c.field !== "Actions");
      newDefs.push({
        headerName: "Actions",
        field: "Actions",
        filter: false,
        cellRenderer: (params) => (
          <div style={{ position: "relative", height: "100%" }}>
            <div className={styles.actions}>
              {actionsCol?.actions?.length ? (
                actionsCol.actions.map((action, i) => (
                  <Icon
                    key={i}
                    onClick={() => action.onClick?.(params.data)}
                    icon={
                      action.icon.condition
                        ? action.icon.condition(params.data)
                        : action.icon.icon
                    }
                    width="1.8rem"
                    style={{
                      color: iconStyle
                        ? iconStyle(params.data).color
                        : "inherit",
                      visibility:
                        action.visible === false ? "hidden" : "visible",
                    }}
                  />
                ))
              ) : (
                <Icon
                  onClick={() => onActionClick?.(params.data)}
                  icon={
                    renderIconWithCondition
                      ? renderIconWithCondition(params.data)
                      : ""
                  }
                  width="1.8rem"
                  style={{
                    color: iconStyle ? iconStyle(params.data).color : "inherit",
                  }}
                />
              )}
            </div>
          </div>
        ),
      });
    }
    setColumnDefs(newDefs);
  }, [colDefs, iconStyle, onActionClick, renderIconWithCondition]);

  return (
    <div
      className={styles.customAgGrid}
      style={{ height: "90%", width: "100%" }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        pagination
        paginationPageSize={pageSize}
        paginationPageSizeSelector={[10, 20, 30]}
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
