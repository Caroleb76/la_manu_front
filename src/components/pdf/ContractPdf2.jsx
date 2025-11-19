import React, { useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import { convertDateToFranceTimeZone } from "../../utils/date";
import LogoIFEN from "../../assets/img/ifen.png";
import AdresseIfen from "../../assets/img/adresse.png";

const styles = {
  h2: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  h3: {
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "underline",
    marginBottom: "10px",
  },

  h4: {
    fontSize: "15px",
    fontWeight: "bold",
  },
  p: {
    fontSize: "15px",
    marginBottom: "5px",
    textAlign: "justify",
    wordBreak: "break-word",
  },
  ul: {
    listStyleType: "disc",
    paddingLeft: "30px",
  },
  li: {
    fontSize: "15px",
    marginBottom: "5px",
    paddingLeft: "30px",
  },
  capitalize: {
    textTransform: "capitalize",
  },
};
const ContractPdf2 = ({ currentContract, totalHours }) => {
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
        doc.save(`contrat-${currentContract.id}.pdf`);
      },
      margin: [40, 40, 40, 40], // marge : top, left, bottom, right en points
      autoPaging: "text",
      x: 0,
      y: 0,
      html2canvas: {
        scale: 0.7,
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

        <button className="btn" onClick={handleExportPDF}>
          Exporter en PDF
        </button>
      </div>

      <div div ref={printRef} style={{ width: "100%", maxWidth: "515pt" }}>
        {currentContract && (
          <div>
            <img
              src={LogoIFEN}
              alt="Logo IFEN"
              aria-label="Logo de l'Institut de Formation"
              style={{ width: "auto", height: "auto", marginBottom: "60px" }}
            />

            <p
              style={{
                ...styles.capitalize,
                marginLeft: "400px",
                marginBottom: "40px",
              }}
            >
              {currentContract.User.gender} {currentContract.User.firstName}{" "}
              {currentContract.User.lastName} <br />
              {currentContract.User.address.address}
              <br />
              {currentContract.User.address.postalCode}{" "}
              {currentContract.User.address.city}
            </p>
            <p style={styles.p}>
              Nous vous confirmons les modalités ainsi que les conditions
              financières de votre intervention dans le cadre de la formation:{" "}
              <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                {currentContract.SessionFormation.Formation.name}
              </span>
              , pour l’année 2025/2026.
            </p>
            <br />
            <p style={styles.h3}>Récapitulatif de/des interventions :</p>
            <br />
            <div style={styles.ul}>
              {currentContract.interventions.map((intervention, key) => (
                <div style={styles.li} key={key}>
                  <div>
                    <p style={styles.h4}>Intervention {key + 1}</p>
                    <p style={styles.p}>
                      module : {intervention.ModuleFormation?.name ?? "N/A"}
                    </p>
                    <p style={styles.p}>durée : {intervention.hours}h</p>
                    <p style={styles.p}>
                      date :{" "}
                      {convertDateToFranceTimeZone(
                        intervention.dateIntervention,
                      )}{" "}
                      -{" "}
                      {intervention.shift === "am"
                        ? "Matin"
                        : intervention.shift === "pm"
                          ? "Après Midi"
                          : "Journée"}
                    </p>
                    <p style={styles.p}></p>
                    <p style={styles.p}>
                      tarif horaire brut - congés payés inclus:{" "}
                      {intervention.InterventionCategory?.rate ?? "N/A"} €
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <br />
            <p style={styles.h3}>
              Total des heures d’intervention du contrat :{" "}
              {totalHours(currentContract.interventions)}h
            </p>
            <br />
            <p style={styles.h4}>Règlement de fonctionnement :</p>
            <p style={styles.p}>
              Le salarié atteste avoir pris connaissance du règlement de
              fonctionnement de l’IFEN. Il s’engage à le respecter et le faire
              respecter lors de ses interventions.
            </p>
            <p style={styles.h4}>
              Respect des engagements de la démarche Qualiopi :{" "}
            </p>
            <p style={styles.p}>
              <li>
                Le salarié doit transmettre au formateur coordinateur lui ayant
                commandé sa ou ses interventions leurs contenus, 10 jours avant
                la réalisation de son ou ses interventions. Ces contenus doivent
                être transmis de façon dématérialisée en utilisant les trames
                transmises par le formateur coordinateur.{" "}
              </li>
              <li>
                Le salarié autorise l’IFEN à transmettre ses supports aux
                apprenants inscrits sur l’action de formation concernée.{" "}
              </li>
              <li>
                Le salarié s’engage à respecter les attendus figurant dans le
                livret de l’intervenant.{" "}
              </li>
            </p>
            <br />
            <p style={styles.p}>
              <span style={{ fontStyle: "italic", fontSize: "11px" }}>
                Conformément à la règlementation en vigueur, vous êtes informé
                que certaines données à caractère personnel vous concernant, que
                nous collectons dans le cadre de votre mission au sein de l’IFEN
                et nécessaires aux organismes sociaux pour la bonne gestion de
                votre dossier, leur seront transmises.
              </span>{" "}
              <br />
              <br />
              Merci de signer ce contrat, de valider votre intervention une fois
              qu'elle sera réalisée et de nous transmettre les justificatifs de
              frais le cas échéant au plus tard le 17 de chaque mois pour un
              paiement du salaire le 30.
            </p>
            <br />
            <p>Contrat établi le {new Date().toLocaleDateString()} </p>
            <br />
            <p style={styles.p}>
              Vous remerciant de votre collaboration, nous vous prions d’agréer
              l’expression de nos meilleures salutations.
            </p>
            <br />
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                marginright: "2rem",
                marginBottom: "5rem",
              }}
            >
              <p style={styles.p}>L’Intervenant</p>
              <p style={styles.p}>Le Directeur Général de l’IFEN</p>
            </div>
            <div>
              <img
                src={AdresseIfen}
                alt="Adresse IFEN"
                style={{
                  width: "240px",
                  height: "auto",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractPdf2;
