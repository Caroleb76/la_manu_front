
import { createContext, useState } from "react";


const UserContext= createContext();
const UserProvider = ({children})=>{
    const [user, setUser] = useState(null);
    const TOKEN_KEY= "token"
    async function getUser (){
        if(user) return user;
        const token = localStorage.getItem(TOKEN_KEY);
        //TODO call the api
        // update the user
        console.log("the user is ",user);
        
        return user;

    }
    
    async function updateUser(userParam){
        if(!user || !user?.token) return;
        setUser(userParam);
        localStorage.setItem(TOKEN_KEY,user.token);
    }

    return (
        <UserContext.Provider value={{getUser,updateUser}}>
            {children}
        </UserContext.Provider>
    )

};

export {UserProvider,UserContext};
/**
 * user == null => localstorage contains token => call api to get info username et email => user = les information 
 * user != null => user
 */