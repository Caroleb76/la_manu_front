import React, { useContext, useEffect, useState } from "react";
import logo from "/src/assets/img/Logo.svg";
import styles from "./Auth.module.css";
import { authMe, login, resetPassword } from "../../helpers/auth";
import { UserContext } from "../../../context/userContext";
import { useNavigate } from "react-router";
import { useNotification } from "../../../context/notificationContext";
import { TOKEN_KEY } from "../../utils/constants";
import PopupWrapper from "../../components/popups/PopupWrapper";
import InputText from "../../components/ui/InputText";
import { set } from "zod/v4-mini";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [popupVisible, setPopupVisible] = useState(false);
  const [userEmail, setUserEmail] = useState("");

    const { user, updateUser } = useContext(UserContext);
    const navigate = useNavigate();
    const { notify } = useNotification();
    useEffect(() => {
        if (user) navigate("/dashboard/main");
    }, []);
        useEffect(() => {
        if (user) navigate("/dashboard/main");
    }, [user, navigate]);
    async function handleLogin(e) {
        e.preventDefault();
        setError(null);
        let response = await login(email, password);
        if (!response.success) {
            setError(response.message);
            return;
        } else {
            localStorage.setItem(TOKEN_KEY, response.data.token);
            notify("Bienvenue dans votre espace vacataires", "success");
            var userData = await authMe();
            updateUser(userData);
            // navigate("/dashboard/main");
        }
    }

    async function handleResetPassword(e) {
      e.preventDefault();
      const reponse = await resetPassword(userEmail);
      if (reponse.success) {
        notify("Un email vous a été envoyé", "success");
      }
      if (!reponse.success) {
        notify(reponse.message, "error");
      }
      setPopupVisible(false);
    }

    return (
        <div className={styles.pageContainer}>
            {popupVisible && (
                <PopupWrapper
                    title="Mot de passe oublié"
                    onClose={() => setPopupVisible(false)}
                >
                    <form onSubmit={handleResetPassword} className={styles.popupForm__container}>
                      <p>Veuillez entrer votre adresse email. Un nouveau mot de passe vous sera envoyé</p>
                        <InputText
                            label="Adresse email"
                            name="email"
                            type="email"
                            value={userEmail}
                            className={styles.popupForm__input}
                            onChange={(e) => setUserEmail(e.target.value)}
                        />
                        <button className="btn btn-primary">Envoyer</button>
                    </form>
                </PopupWrapper>
            )}

            <img src={logo} alt="logo de l'IFEN" />
            <h1>Bienvenue dans l'espace vacataires</h1>
            <form action="" className={styles.loginForm}>
                {error && (
                    <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
                )}
                <div>
                    <label htmlFor="email">Adresse email</label>
                    <input
                        type="email"
                        name="email"
                        id=""
                        value={email}
                        onInput={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        type="password"
                        name="password"
                        id=""
                        value={password}
                        onInput={(e) => setPassword(e.target.value)}
                    />
                    <div className={styles.fullWidth}>
                        <a href="#" onClick={() => setPopupVisible(true)}>
                            Mot de passe oublié
                        </a>
                    </div>
                </div>

                <button
                    type="submit"
                    onClick={handleLogin}
                    className="btn btn-primary"
                >
                    Se connecter
                </button>
            </form>
        </div>
    );
}
