
import { createContext, useState } from "react";
import { TOKEN_KEY } from "../src/utils/constants";
import { authMe } from "../src/helpers/auth";


const UserContext= createContext();
const UserProvider = ({children})=>{
    const [user, setUser] = useState(null);
    async function getUser (){
        if(user) return user;
        //TODO call the api
        // call authMe to get user with the token
        // update the user
        const responseUser= await authMe();
        await updateUser(responseUser);
        
        return responseUser;

    }
    
    async function updateUser(userParam){
        
        
        if(!userParam || !userParam?.token) return;
        setUser(userParam);

        localStorage.setItem(TOKEN_KEY,userParam.token);
    }
    
    function signout(){
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);

    }

    return (
        <UserContext.Provider value={{getUser,updateUser,signout}}>
            {children}
        </UserContext.Provider>
    )

};

export {UserProvider,UserContext};
/**
 * user == null => localstorage contains token => call api to get info username et email => user = les information 
 * user != null => user
 */