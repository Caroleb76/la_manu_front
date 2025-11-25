import { useContext, useEffect } from "react";
import { UserContext } from "../../../context/userContext";
import { Navigate, Outlet, useNavigate } from "react-router";


const AuthGuard = ({ children }) => {
  const { user, loading } = useContext(UserContext);
  let navigate = useNavigate();
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
      }
      else{
        const currentPath = window.location.pathname;
        console.log("currentPath", currentPath);
        if(currentPath === "/"){

          navigate("/dashboard/main");
        }
      }
      
    }

  }, [loading, user, navigate])
  if (loading ) {
    return <p>Loading...</p>; // or a proper spinner
  }


  return <Outlet />;


}

export default AuthGuard;