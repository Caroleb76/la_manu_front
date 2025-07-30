import { useContext, useEffect } from "react";
import { UserContext } from "../../../context/userContext";
import { Navigate, Outlet, useNavigate } from "react-router";


const AuthGuard = ({ children }) => {
    const { user, loading } = useContext(UserContext);
    let navigate = useNavigate();
useEffect(() => {
     if (!user) {
    navigate("/login");
  }else{
    navigate("/dashboard/main");
  }
 
},[loading])
  if (loading) {
    return <p>Loading...</p>; // or a proper spinner
  }


  return <Outlet />;


}

export default AuthGuard;