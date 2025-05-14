import { useContext, useEffect } from "react";
import { UserContext } from "../../../context/userContext";
import { Outlet, useNavigate } from "react-router";


const AuthGuard = ({children})=>{
    const {getUser,updateUser}= useContext(UserContext);
    let navigate = useNavigate();
    useEffect(()=>{
        getUser().then(user=>{
            console.log("user in useEffect is ",user);
            if(user == null){
                navigate("/login");
            }else{
                navigate("/dashboard/main");
    
            }

        });
        
        
    },[])
    return <>
        <Outlet/>
    </>

}

export default AuthGuard;