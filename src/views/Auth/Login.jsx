import React from "react";
import logo from "/src/assets/img/Logo.svg";

export default function Login() {
  return (
    <div>
      <img src={logo} alt="logo de l'IFEN" />
      <h1>Bienvenue dans l'espace vacataires</h1>
      <form action="">
        <label htmlFor="email">Adresse email</label>
        <input type="email" name="email" id="" />
        <label htmlFor="password">Mot de passe</label>
        <input type="password" name="password" id="" />
        <small>Mot de passe oublié</small>
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}
