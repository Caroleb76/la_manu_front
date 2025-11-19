import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import contractsHelper from "../../../helpers/contractsHelper";
import { useParams } from "react-router";
import ContractPdf from "../../../components/pdf/ContractPdf";
import ContractPdf2 from "../../../components/pdf/ContractPdf2";
import { convertDateToFranceTimeZone } from "../../../utils/date";
import styles from "./ViewContract.module.css";
export default function ViewContract() {
  const { contractId } = useParams();
  const [currentContract, setCurrentContract] = useState(null);

  function totalHours(interventions) {
    let total = 0;
    interventions.forEach((intervention) => {
      total += parseInt(intervention.hours);
    });
    return total;
  }

  useEffect(() => {
    const getContract = async () => {
      try {
        const contractResponse = await contractsHelper.getContract(contractId);
        if (!contractResponse) return;
        setCurrentContract(contractResponse.data);
      } catch (error) {
        console.error(error);
      }
    };
    getContract();
  }, []);
  return (
    <div>
      <ContractPdf2 currentContract={currentContract} totalHours={totalHours} />
    </div>
  );
}
