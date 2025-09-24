import { useEffect, useState } from "react";
import styles from "./StatsWidget.module.css";
import interventionsHelper from "../../../helpers/interventionsHelper";

//nombre de contrats signés dans le mois => pas de champs nécessaire
// le montant total des interventions validées par les formateurs du mois ,
// le total des extracosts du mois,
// le nombre de formateur mobilisés depuis le début de l'année
export default function StatsWidget() {
    // eslint-disable-next-line no-undef
    const [categoryWithHours, setCategoryWithHours] = useState([]);
    const [totalAmountPerMonth, setTotalAmountPerMonth] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const response = {
                categoryWithHours: await interventionsHelper.getTotalHoursPerCategory(),
                totalAmountPerMonth: await interventionsHelper.getTotalAmountPerMonth(),
            };

            console.log("reponse", response);
            if (response) {
                setCategoryWithHours(response.categoryWithHours.data);
                setTotalAmountPerMonth(response.totalAmountPerMonth.data);
            }
        };
        getData();
    }, []);

    return (
        <div className={styles.statsContainer}>
            <div className={styles.statSection}>
                <h1 className={styles.statTitle}>
                    Heures par catégorie d'intervention
                </h1>
                <div className={styles.statContent}>
                    {categoryWithHours?.map((category, index) => (
                        <div key={index}>
                            <h3 className={styles.statLabel}>
                                {category.name}
                            </h3>
                            <p>{category.hours} heures</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.statSection}>
                <h1 className={styles.statTitle}>
                    Montant total des interventions du mois
                </h1>
                    <div className={styles.statContent}>
                        <h3 className={styles.statLabel}>Pour le mois de {new Date().toLocaleDateString("fr-FR", { month: "long" })}</h3>
                        <p className={styles.statLabel}>{totalAmountPerMonth.count} intervention(s)</p>
                        <p className={styles.statLabel}>Total : {totalAmountPerMonth.totalAmount} €</p>
                        
                    </div>
              
            </div>
            <div className={styles.statSection}>
                {categoryWithHours?.map((category, index) => (
                    <div key={index}>
                        <h3 className={styles.statLabel}>{category.name}</h3>
                        <p>{category.hours} heures</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
