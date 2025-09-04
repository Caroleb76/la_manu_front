import React, { useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import { convertDateToFranceTimeZone } from "../../utils/date";

const styles = {
    h2: {
        fontSize: "20px",
        fontWeight: "bold",
        marginBottom: "20px",
    },
    h3: {
        fontSize: "18px",
        fontWeight: "bold",
        marginBottom: "10px",
    },
    p: {
        fontSize: "14px",
        marginBottom: "5px",
    },
    ul: {
        listStyleType: "disc",
        paddingLeft: "20px",
    },
    li: {
        fontSize: "14px",
        marginBottom: "5px",
    },
    capitalize: {
        textTransform: "capitalize",
    },
};
const ContractPdf2 = ({ currentContract, totalHours }) => {
    useEffect(() => {
        console.log("currentContract", currentContract);
    });
    const printRef = useRef();

    const handleExportPDF = () => {
        const doc = new jsPDF({
            unit: "pt",
            format: "a4",
            putOnlyUsedFonts: true,
            floatPrecision: 16,
        });

        doc.html(printRef.current, {
            callback: (doc) => {
                doc.save(`recapitulatif-contrat-${currentContract.id}.pdf`);
            },
            margin: [40, 20, 40, 20], // marge : top, left, bottom, right en points
            autoPaging: "text",
            x: 0,
            y: 0,
            html2canvas: {
                scale: 0.8,
                letterRendering: true,
                useCORS: true,
            },
        });
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h2 style={styles.h2}>Récapitulatif du contrat</h2>
 
                <button onClick={handleExportPDF}>Exporter en PDF</button>
            </div>

            <div ref={printRef}>
                {currentContract && (
                    <div>
                        <p style={styles.capitalize}>
                            {currentContract.User.gender}{" "}
                            {currentContract.User.firstName}{" "}
                            {currentContract.User.lastName}{" "}
                        </p>
                        <p style={styles.capitalize}>
                            {currentContract.User.address.address} <br />
                            {currentContract.User.address.postalCode}{" "}
                            {currentContract.User.address.city}
                        </p>
                        <p>
                            {" "}
                            Nous vous confirmons les modalités ainsi que les
                            conditions financières de votre intervention dans le
                            cadre de la formation:{" "}
                            {currentContract.SessionFormation.Formation.name},
                            pour l’année 2025/2026
                        </p>
                        <p>Référence de l’intervention :</p>
                        <div style={styles.ul}>
                            {currentContract.interventions.map(
                                (intervention, key) => (
                                    <div style={styles.li} key={key}>
                                        <div>
                                            <p style={styles.h4}>
                                                Intervention {key + 1}
                                            </p>
                                            <p>
                                                {
                                                    intervention.ModuleFormation
                                                        .name
                                                }
                                            </p>
                                            <p>{intervention.hours}h</p>
                                            <p>
                                                {convertDateToFranceTimeZone(
                                                    intervention.dateIntervention
                                                )}{" "}
                                                -{" "}
                                                {intervention.shift === "am"
                                                    ? "Matin"
                                                    : intervention.shift ===
                                                      "pm"
                                                    ? "Après Midi"
                                                    : "Journée"}
                                            </p>
                                            <p></p>
                                            <p>
                                                {
                                                    intervention
                                                        .InterventionCategory
                                                        .rate
                                                }{" "}
                                                €
                                            </p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                        <p>
                            Total heures d’intervention :{" "}
                            {totalHours(currentContract.interventions)}h
                        </p>
                        <p style={styles.h3}>Règlement de fonctionnement :</p>
                        <p>
                            Le salarié atteste avoir pris connaissance du
                            règlement de fonctionnement de l’IFEN. Il s’engage à
                            le respecter et le faire respecter lors de ses
                            interventions. Respect des engagements de la
                            démarche Qualiopi • Le salarié doit transmettre au
                            formateur coordinateur lui ayant commandé sa ou ses
                            interventions leurs contenus, 10 jours avant la
                            réalisation de son ou ses interventions. Ces
                            contenus doivent être transmis de façon
                            dématérialisée en utilisant les trames transmises
                            par le formateur coordinateur. • Le salarié autorise
                            l’IFEN à transmettre ses supports aux apprenants
                            inscrits sur l’action de formation concernée. • Le
                            salarié s’engage à respecter les attendus figurant
                            dans le livret de l’intervenant "Conformément à la
                            règlementation en vigueur, vous êtes informé que
                            certaines données à caractère personnel vous
                            concernant, que nous collectons dans le cadre de
                            votre mission au sein de l’IFEN et nécessaires aux
                            organismes sociaux pour la bonne gestion de votre
                            dossier, leur seront transmises. " Merci de nous
                            retourner un exemplaire de ce contrat ainsi que le
                            relevé mensuel d’intervention (récapitulant les
                            interventions réalisées) dûment signés au plus tard
                            le 17 de chaque mois. Nous attirons votre attention
                            sur le fait que ces documents nous sont
                            indispensables pour procéder à votre règlement.
                        </p>
                        <p>
                            Contrat fait en double exemplaire le{" "}
                            {new Date().toLocaleDateString()}{" "}
                        </p>

                        <p>
                            Vous remerciant de votre collaboration, nous vous
                            prions d’agréer l’expression de nos meilleures
                            salutations.
                        </p>
                        <p>L’Intervenant</p>
                        <p>Le Directeur Général de l’IFEN</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContractPdf2;
