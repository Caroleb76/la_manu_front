import { useEffect, useRef, useState } from "react";
import DataGrid from "../../components/DataGrid/DataGrid";
import usersHelper from "../../helpers/usersHelper";
import Styles from "./User.module.css";
import PopupCreateUser from "../PopupCreateUser/PopupCreateUser";
function Users() {
  const [total, setTotal]=useState(0);
  const [users, setUsers] = useState([]);
  const [userCreationMode, setUserCreationMode] = useState(false);
  const [offset, setOffset] =useState (0);
  const [limit, setLimit] = useState(10);
  const colDefs = [
    { field: "Email", filter: true },
    { field: "Nom", filter: true },
    { field: "Prenom", filter: true },
    { field: "Role", filter: true },
    { field: "Actions", filter: false },
  ];
  useEffect(() => {
    async function getUsers() {
      const response = await usersHelper.getUsers(offset, limit );
      const responseUsers = response.data.users;
      // console.log(responseUsers);
setTotal (
  response.data.total
)
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
  const updatedUser= data
   setUsers(prevUsers => {
    const filteredUsers = prevUsers.filter(it => it.id !== updatedUser.id);
    console.log("Utilisateurs filtrés :", filteredUsers);
    return [...filteredUsers, updatedUser];
  });

  console.log (response)
}

  return (
    <div className={Styles.mainContainer}>
      {
        userCreationMode && <PopupCreateUser onClose={() => setUserCreationMode(false)}/>
      }
      <button className={Styles.addButton} onClick={() => setUserCreationMode(true)}>Créer</button>
      <DataGrid colDefs={colDefs} data={
      {
  getRows: async (params) => {
    const offset = params.startRow;
    const limit = params.endRow - params.startRow;

    console.log("Requête : offset=", offset, "limit=", limit);

    // Appel API
    const response = await usersHelper.getUsers(offset, limit );
    const rows = response.data.users; // tes données
    const total = response.data.total; // nombre total d’éléments pour la pagination

    params.successCallback(rows, total);
  }
}
      } onActionClick={blockUser} renderIconWithCondition={(user)=>{return user.blocked? "material-symbols:lock-outline":"material-symbols:lock-open-right-outline-sharp"}}/>
    </div>
  );
}

export default Users;
