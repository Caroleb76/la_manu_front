 <Document>
            <Page>
                <p style={styles.h2}>Récapitulatif du contrat {currentContract.id}</p>
                           {currentContract && (
                               <div>
                                   <p style={styles.capitalize}>
                                       {currentContract.User.gender}{" "}
                                       {currentContract.User.firstName}{" "}
                                       {currentContract.User.lastName}{" "}
                                   </p>
                                   <p style={styles.capitalize}>
                                       {currentContract.User.address.address}{" "} <br />
                                       {currentContract.User.address.postalCode}{" "} 
                                       {currentContract.User.address.city}
                                   </p>
                                   <p>
                                       {" "}
                                       Nous vous confirmons les modalités ainsi que les
                                       conditions financières de votre intervention dans le
                                       cadre de la formation:{" "}
                                       {currentContract.SessionFormation.Formation.name}, pour
                                       l’année 2025/2026
                                   </p>
                                   <p>Référence de l’intervention :</p>
                                   <div style={styles.ul}>
                                       {currentContract.interventions.map(
                                           (intervention, key) => (
                                               <div style={styles.li} key={key}>
                                                   <div>
                                                       <p style={styles.h4}>Intervention {key + 1}</p>
                                                       <p>
                                                           {intervention.ModuleFormation.name}
                                                       </p>
                                                       <p>{intervention.hours}h</p>
                                                       <p>
                                                           {convertDateToFranceTimeZone(
                                                               intervention.dateIntervention
                                                           )}{" "}
                                                           -{" "}
                                                           {intervention.shift === "am"
                                                               ? "Matin"
                                                               : intervention.shift === "pm"
                                                               ? "Après Midi"
                                                               : "Journée"}
                                                       </p>
                                                       <p></p>
                                                       <p>
                                                           {
                                                               intervention
                                                                   .InterventionCategory.rate
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
                                       Le salarié atteste avoir pris connaissance du règlement
                                       de fonctionnement de l’IFEN. Il s’engage à le respecter
                                       et le faire respecter lors de ses interventions. Respect
                                       des engagements de la démarche Qualiopi • Le salarié
                                       doit transmettre au formateur coordinateur lui ayant
                                       commandé sa ou ses interventions leurs contenus, 10
                                       jours avant la réalisation de son ou ses interventions.
                                       Ces contenus doivent être transmis de façon
                                       dématérialisée en utilisant les trames transmises par le
                                       formateur coordinateur. • Le salarié autorise l’IFEN à
                                       transmettre ses supports aux apprenants inscrits sur
                                       l’action de formation concernée. • Le salarié s’engage à
                                       respecter les attendus figurant dans le livret de
                                       l’intervenant "Conformément à la règlementation en
                                       vigueur, vous êtes informé que certaines données à
                                       caractère personnel vous concernant, que nous collectons
                                       dans le cadre de votre mission au sein de l’IFEN et
                                       nécessaires aux organismes sociaux pour la bonne gestion
                                       de votre dossier, leur seront transmises. " Merci de
                                       nous retourner un exemplaire de ce contrat ainsi que le
                                       relevé mensuel d’intervention (récapitulant les
                                       interventions réalisées) dûment signés au plus tard le
                                       17 de chaque mois. Nous attirons votre attention sur le
                                       fait que ces documents nous sont indispensables pour
                                       procéder à votre règlement.
                                   </p>
                                   <p>
                                       Contrat fait en double exemplaire le{" "}
                                       {new Date().toLocaleDateString()}{" "}
                                   </p>
               
                                   <p>
                                       Vous remerciant de votre collaboration, nous vous prions
                                       d’agréer l’expression de nos meilleures salutations.
                                   </p>
                                   <p>L’Intervenant</p>
                                   <p>Le Directeur Général de l’IFEN</p>
                               </div>
                           )}
            </Page>
        </Document>



-----------------------------------------------

 <h1>Récapitulatif du contrat</h1>
            {currentContract && (
                <div>
                    <p className={styles.capitalize}>
                        {currentContract.User.gender}{" "}
                        {currentContract.User.firstName}{" "}
                        {currentContract.User.lastName}{" "}
                    </p>
                    <p className={styles.capitalize}>
                        {currentContract.User.address.address}{" "} <br />
                        {currentContract.User.address.postalCode}{" "} 
                        {currentContract.User.address.city}
                    </p>
                    <p>
                        {" "}
                        Nous vous confirmons les modalités ainsi que les
                        conditions financières de votre intervention dans le
                        cadre de la formation:{" "}
                        {currentContract.SessionFormation.Formation.name}, pour
                        l’année 2025/2026
                    </p>
                    <p>Référence de l’intervention :</p>
                    <ul>
                        {currentContract.interventions.map(
                            (intervention, key) => (
                                <li key={key}>
                                    <div>
                                        <h4>Intervention {key + 1}</h4>
                                        <p>
                                            {intervention.ModuleFormation.name}
                                        </p>
                                        <p>{intervention.hours}h</p>
                                        <p>
                                            {convertDateToFranceTimeZone(
                                                intervention.dateIntervention
                                            )}{" "}
                                            -{" "}
                                            {intervention.shift === "am"
                                                ? "Matin"
                                                : intervention.shift === "pm"
                                                ? "Après Midi"
                                                : "Journée"}
                                        </p>
                                        <p></p>
                                        <p>
                                            {
                                                intervention
                                                    .InterventionCategory.rate
                                            }{" "}
                                            €
                                        </p>
                                    </div>
                                </li>
                            )
                        )}
                    </ul>
                    <p>
                        Total heures d’intervention :{" "}
                        {totalHours(currentContract.interventions)}h
                    </p>
                    <h3>Règlement de fonctionnement :</h3>
                    <p>
                        Le salarié atteste avoir pris connaissance du règlement
                        de fonctionnement de l’IFEN. Il s’engage à le respecter
                        et le faire respecter lors de ses interventions. Respect
                        des engagements de la démarche Qualiopi • Le salarié
                        doit transmettre au formateur coordinateur lui ayant
                        commandé sa ou ses interventions leurs contenus, 10
                        jours avant la réalisation de son ou ses interventions.
                        Ces contenus doivent être transmis de façon
                        dématérialisée en utilisant les trames transmises par le
                        formateur coordinateur. • Le salarié autorise l’IFEN à
                        transmettre ses supports aux apprenants inscrits sur
                        l’action de formation concernée. • Le salarié s’engage à
                        respecter les attendus figurant dans le livret de
                        l’intervenant "Conformément à la règlementation en
                        vigueur, vous êtes informé que certaines données à
                        caractère personnel vous concernant, que nous collectons
                        dans le cadre de votre mission au sein de l’IFEN et
                        nécessaires aux organismes sociaux pour la bonne gestion
                        de votre dossier, leur seront transmises. " Merci de
                        nous retourner un exemplaire de ce contrat ainsi que le
                        relevé mensuel d’intervention (récapitulant les
                        interventions réalisées) dûment signés au plus tard le
                        17 de chaque mois. Nous attirons votre attention sur le
                        fait que ces documents nous sont indispensables pour
                        procéder à votre règlement.
                    </p>
                    <p>
                        Contrat fait en double exemplaire le{" "}
                        {new Date().toLocaleDateString()}{" "}
                    </p>

                    <p>
                        Vous remerciant de votre collaboration, nous vous prions
                        d’agréer l’expression de nos meilleures salutations.
                    </p>
                    <p>L’Intervenant</p>
                    <p>Le Directeur Général de l’IFEN</p>
                </div>
            )}