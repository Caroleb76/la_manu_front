import { useEffect, useState } from "react";
import styles from "./StatsWidget.module.css";
import interventionsHelper from "../../../helpers/interventionsHelper";
import StatWidgetWrapper from "./StatWidgetWrapper";

//nombre de contrats signés dans le mois => pas de champs nécessaire
// le total des extracosts du mois,
// le nombre de formateur mobilisés depuis le début de l'année
export default function StatsWidget() {
    // eslint-disable-next-line no-undef
    const [categoryWithHours, setCategoryWithHours] = useState([]);
    const [totalAmountPerMonth, setTotalAmountPerMonth] = useState([]);
    const [totalExtraCostPerMonth, setTotalExtraCostPerMonth] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const response = {
                categoryWithHours:
                    await interventionsHelper.getTotalHoursPerCategory(),
                totalAmountPerMonth:
                    await interventionsHelper.getTotalAmountPerMonth(),
                totalExtraCostPerMonth:
                    await interventionsHelper.getTotalExtraCostPerMonth(),
            };

            if (response) {
                setCategoryWithHours(response.categoryWithHours.data);
                setTotalAmountPerMonth(response.totalAmountPerMonth.data);
                setTotalExtraCostPerMonth(response.totalExtraCostPerMonth.data);
            }
        };
        getData();
    }, []);

    return (
        <div className={styles.statsContainer}>
            <StatWidgetWrapper title="Heures par catégorie d'intervention">
                {categoryWithHours?.map((category, index) => (
                    <div key={index}>
                        <h3 className={styles.statLabel}>{category.name}</h3>
                        <p>{category.hours} heures</p>
                    </div>
                ))}
            </StatWidgetWrapper>

            <StatWidgetWrapper title="Côut total des interventions du mois">
                <h3 className={styles.statLabel}>
                    Pour le mois :{" "}
                    <span className={styles.date}>
                        {new Date().toLocaleDateString("fr-FR", {
                            month: "long",
                        })}
                    </span>
                </h3>
                <p className={styles.statLabel}>
                    {totalAmountPerMonth.count} intervention(s)
                </p>
                <p className={styles.statLabel}>
                    Total : {totalAmountPerMonth.totalAmount} €
                </p>
            </StatWidgetWrapper>

            <StatWidgetWrapper title="Coûts des frais de déplacement par mois">
                <h3 className={styles.statLabel}>
                    Pour le mois :{" "}
                    <span className={styles.date}>
                        {new Date().toLocaleDateString("fr-FR", {
                            month: "long",
                        })}
                    </span>
                </h3>
                <p className={styles.statLabel}>
                    {totalExtraCostPerMonth.count} frais de déplacement
                </p>
                <p className={styles.statLabel}>
                    Total : {totalExtraCostPerMonth.totalAmount} €
                </p>
            </StatWidgetWrapper>
        </div>
    );
}
