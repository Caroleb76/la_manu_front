import { useEffect, useState } from "react";
import DataGrid from "../../components/DataGrid/DataGrid";
import usersHelper from "../../helpers/usersHelper";

function Users() {
    const [users, setUsers] = useState([]);
    const colDefs =   [{ field: "Email", filter: true },
        { field: "Nom", filter: true },
        { field: "Prenom", filter: true },
        { field: "Role", filter: true },
        { field: "Actions", filter: false }];
    useEffect(() => {
      async function getUsers() {
        const response = await usersHelper.getUsers();
        const responseUsers = response.data;
        console.log(responseUsers);
  
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
    }, []);
    return ( 
        <>
        <DataGrid colDefs={colDefs} data={users}/>
        </>
     );
}

export default Users;