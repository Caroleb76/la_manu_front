import React, { useContext, useEffect, useState } from "react";
import logo from "/src/assets/img/Logo.svg";
import styles from "./Auth.module.css";
import { login } from "../../helpers/auth";
import { UserContext } from "../../../context/userContext";
import { useNavigate } from "react-router";
import { useNotification } from "../../../context/notificationContext";

export default function Login() {


    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError]=useState(null);
    const {getUser,updateUser}= useContext(UserContext);
    const navigate= useNavigate();
    const {notify}= useNotification();
    useEffect(()=>{
      getUser().then(user=>{
        if(user) navigate("/dashboard/main");
      });
    },[])
    async function handleLogin (e){
      e.preventDefault();
      setError(null);
     let response= await login(email,password);
     if(!response.success) {
      setError(response.message);
      return;
     }else{
      notify("Bienvenue dans votre espace vacataires","success");
      updateUser(response.data.user);
      navigate("/dashboard/main");
     }
    }
  return (
    <div className={styles.pageContainer}>
      <img src={logo} alt="logo de l'IFEN" />
      <h1>Bienvenue dans l'espace vacataires</h1>
      <form action="" className={styles.loginForm}>
        {
          error && 
          <p style={{color:"red",fontWeight:"bold"}}>{error}</p>
        }
        <div>
          <label htmlFor="email">Adresse email</label>
          <input type="email" name="email" id="" value={email} onInput={e=> setEmail(e.target.value)} />
        </div>

        <div>
          <label htmlFor="password">Mot de passe</label>
          <input type="password" name="password" id="" value={password} onInput={e=> setPassword(e.target.value)} />
          <div className={styles.fullWidth}>
            <a href="#">Mot de passe oublié</a>
          </div>
        </div>

        <button type="submit" onClick={handleLogin}>Se connecter</button>
      </form>
    </div>
  );
}
