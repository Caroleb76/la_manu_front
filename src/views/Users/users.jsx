import { useEffect, useRef, useState } from "react";
import DataGrid from "../../components/DataGrid/DataGrid";
import usersHelper from "../../helpers/usersHelper";
import Styles from "./User.module.css";
import PopupCreateUser from "../PopupCreateUser/PopupCreateUser";
function Users() {
  const [users, setUsers] = useState([]);
  const [userCreationMode, setUserCreationMode] = useState(false);
  const colDefs = [
    { field: "Email", filter: true },
    { field: "Nom", filter: true },
    { field: "Prenom", filter: true },
    { field: "Role", filter: true },
    { field: "Actions", filter: false },
  ];
  useEffect(() => {
    async function getUsers() {
      const response = await usersHelper.getUsers();
      const responseUsers = response.data;
      // console.log(responseUsers);

      setUsers(
        responseUsers.map((user) => ({
          Nom: user.lastName,
          Prenom: user.firstName,
          Email: user.email,
          Role: user.role.name,
        }))
      );
    }
    getUsers();
  }, [userCreationMode]);




  return (
    <div className={Styles.mainContainer}>
      {
        userCreationMode && <PopupCreateUser onClose={() => setUserCreationMode(false)}/>
      }
      <button className={Styles.addButton} onClick={() => setUserCreationMode(true)}>Créer</button>
      <DataGrid colDefs={colDefs} data={users} />
    </div>
  );
}

export default Users;
