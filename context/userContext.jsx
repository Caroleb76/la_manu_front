
import { createContext, useEffect, useState } from "react";
import { TOKEN_KEY } from "../src/utils/constants";
import { authMe } from "../src/helpers/auth";


const UserContext = createContext();
const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading,setLoading] = useState(true);


    useEffect(() => {
        const init = async () => {
            try {
                const token = localStorage.getItem(TOKEN_KEY);
                if(token && !user){
                    const responseUser = await authMe();
                    // console.log("from context useEffect");
                    await updateUser(responseUser);
                    
                }
            } catch (error) {
                console.error(error);
                signout();   
            }finally{
                setLoading(false);
            }
        }
        init();
    },[])


    async function updateUser(userParam) {


        if (!userParam ) return;
        // console.log("user is updated" , userParam);
        
        setUser(userParam);

        
        
    }

    function signout() {
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);

    }

    return (
        <UserContext.Provider value={{ user, updateUser, signout,loading }}>
            {children}
        </UserContext.Provider>
    );


};

export { UserProvider, UserContext };
/**
 * user == null => localstorage contains token => call api to get info username et email => user = les information 
 * user != null => user
 */