import React, { useEffect, useRef } from "react";
import { jsPDF } from "jspdf";

const ContractPdf = ({ currentContract }) => {

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
                ref={printRef}
                style={{
                    padding: 20,
                    fontFamily: "Arial, sans-serif",
                    fontSize: 12,
                    color: "#000",
                }}
            >
                {/* <h2>Récapitulatif du contrat {currentContract.id}</h2> */}
                {currentContract && (
                    <div>
                        <p>
                            {currentContract.User.gender}{" "}
                            {currentContract.User.firstName}{" "}
                            {currentContract.User.lastName}
                        </p>
                        <p>
                            {currentContract.User.address.address} <br />
                            {currentContract.User.address.postalCode}{" "}
                            {currentContract.User.address.city}
                        </p>
                        <p>
                            Nous vous confirmons les modalités ainsi que les
                            conditions financières de votre intervention dans le
                            cadre de la formation :{" "}
                            {currentContract.SessionFormation.Formation.name},
                            pour l’année 2025/2026.
                        </p>
                        <h3>Référence de l’intervention :</h3>
                        <ul>
                            {currentContract.interventions.map(
                                (intervention, key) => (
                                    <li key={key} style={{ marginBottom: 10 }}>
                                        <strong>Intervention {key + 1}</strong>
                                        <br />
                                        {
                                            intervention.ModuleFormation.name
                                        } - {intervention.hours}h <br />
                                        {new Date(
                                            intervention.dateIntervention
                                        ).toLocaleDateString("fr-FR")}{" "}
                                        -{" "}
                                        {intervention.shift === "am"
                                            ? "Matin"
                                            : intervention.shift === "pm"
                                            ? "Après Midi"
                                            : "Journée"}{" "}
                                        <br />
                                        Tarif :{" "}
                                        {
                                            intervention.InterventionCategory
                                                .rate
                                        }{" "}
                                        €
                                    </li>
                                )
                            )}
                        </ul>
                        <p>
                            Total heures d’intervention :{" "}
                            {currentContract.interventions.reduce(
                                (acc, i) => acc + i.hours,
                                0
                            )}
                            h
                        </p>
                        <h3>Règlement de fonctionnement :</h3>
                        <p style={{ textAlign: "justify" }}>
                            Le salarié atteste avoir pris connaissance du
                            règlement de fonctionnement de l’IFEN... Le salarié
                            atteste avoir pris connaissance du règlement de
                            fonctionnement de l’IFEN. Il s’engage à le respecter
                            et le faire respecter lors de ses interventions.
                            Respect des engagements de la démarche Qualiopi • Le
                            salarié doit transmettre au formateur coordinateur
                            lui ayant commandé sa ou ses interventions leurs
                            contenus, 10 jours avant la réalisation de son ou
                            ses interventions. Ces contenus doivent être
                            transmis de façon dématérialisée en utilisant les
                            trames transmises par le formateur coordinateur. •
                            Le salarié autorise l’IFEN à transmettre ses
                            supports aux apprenants inscrits sur l’action de
                            formation concernée. • Le salarié s’engage à
                            respecter les attendus figurant dans le livret de
                            l’intervenant "Conformément à la règlementation en
                            vigueur, vous êtes informé que certaines données à
                            caractère personnel vous concernant, que nous
                            collectons dans le cadre de votre mission au sein de
                            l’IFEN et nécessaires aux organismes sociaux pour la
                            bonne gestion de votre dossier, leur seront
                            transmises. " Merci de nous retourner un exemplaire
                            de ce contrat ainsi que le relevé mensuel
                            d’intervention (récapitulant les interventions
                            réalisées) dûment signés au plus tard le 17 de
                            chaque mois. Nous attirons votre attention sur le
                            fait que ces documents nous sont indispensables pour
                            procéder à votre règlement.
                        </p>
                        <p>
                            Contrat fait en double exemplaire le{" "}
                            {new Date().toLocaleDateString()}
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
            <button onClick={handleExportPDF} style={{ marginTop: 20 }}>
                Exporter en PDF
            </button>
        </div>
    );
};

export default ContractPdf;
