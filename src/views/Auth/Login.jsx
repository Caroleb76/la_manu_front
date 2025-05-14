import React from "react";
import logo from "/src/assets/img/Logo.svg";
import styles from "./Auth.module.css";

export default function Login() {

  return (
    <div className={styles.pageContainer}>
      <img src={logo} alt="logo de l'IFEN" />
      <h1>Bienvenue dans l'espace vacataires</h1>
      <form action="" className={styles.loginForm}>
        <div>
          <label htmlFor="email">Adresse email</label>
          <input type="email" name="email" id="" />
        </div>

        <div>
          <label htmlFor="password">Mot de passe</label>
          <input type="password" name="password" id="" />
          <div className={styles.fullWidth}>
            <a href="#">Mot de passe oublié</a>
          </div>
        </div>

        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}
