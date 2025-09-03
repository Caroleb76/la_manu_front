import { useEffect, useContext, useState } from "react";
import { UserContext } from "../../../../context/userContext";
import contractsHelper from "../../../helpers/contractsHelper";
import {convertDateToFranceTimeZone} from "../../../utils/date"
export default function Tasks() {
    const { user } = useContext(UserContext);
    const [contracts, setContracts] = useState([]);

    function filterSignedContracts(contracts) {
        return contracts.filter((contract) => !contract.signed);
    }

    // récupérer les contrats NON signés
    useEffect(() => {
        const getUnsignedContracts = async () => {
            const response = await contractsHelper.getContractsByUserId(
                user.id
            );
            if (response) {
                const contracts = response.data
                const unsignedContracts=filterSignedContracts(contracts);
                setContracts(unsignedContracts);
            }
        };

        getUnsignedContracts();
    }, []);

    return (
        <div>
            <h2>Contrats à signer: </h2>
            <ul>
                {contracts?.map((contract) => (
                    <li key={contract.id}>
                        {contract.SessionFormation.Formation.name} - Du{" "}
                        {convertDateToFranceTimeZone(contract.startDate)} au {convertDateToFranceTimeZone(contract.endDate)}
                    </li>
                ))}
            </ul>
        </div>
    );
}
