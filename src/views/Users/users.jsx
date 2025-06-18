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
          id: user.id,
          Nom: user.lastName,
          Prenom: user.firstName,
          Email: user.email,
          Role: user.role.name,
          blocked: user.blocked
        }))
      );
    }
    getUsers();
  }, [userCreationMode]);


async function blockUser (data){ 
  data.blocked=!data.blocked
  console.log(data)
  const response = await usersHelper.blockUser(data.id, data)
  console.log (response)
}

  return (
    <div className={Styles.mainContainer}>
      {
        userCreationMode && <PopupCreateUser onClose={() => setUserCreationMode(false)}/>
      }
      <button className={Styles.addButton} onClick={() => setUserCreationMode(true)}>Créer</button>
      <DataGrid colDefs={colDefs} data={users} onActionClick={blockUser} renderIconWithCondition={(user)=>{return user.blocked? "material-symbols:lock-outline":"material-symbols:lock-open-right-outline-sharp"}}/>
    </div>
  );
}

export default Users;
