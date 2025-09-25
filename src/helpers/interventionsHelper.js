import apiClient from "./apiClient";
import dayjs from "dayjs";

async function getInterventions (offset=0,limit=10,searchText=""){

    const params= {
        offset,limit,searchText
    };
    const response= await apiClient("interventions/",{method:"GET",params});
    return response;
}

async function getById (userId){
    const response= await apiClient("interventions/id/"+userId,{method:"GET"});
    return response;
}

async function getByUserId (id){

    const params= {
       id
    };
    const response= await apiClient("interventions/user/"+id,{method:"GET",params});
    return response;
}


async function getInterventionsByContractId (contractId){

    if(!contractId) return;
    const response= await apiClient(`interventions/contract/${contractId}`,{method:"GET"});
    return response;
}

async function getByFormationAndUserId (formationId,userId){

    const response= await apiClient(`interventions/user/${userId}/formation/${formationId}`,{method:"GET"});
    return response;
}


async function validateIntervention(interventionId){

    const response= await apiClient(`interventions/validate/${interventionId}`,{method:"POST"});
    
    return response;
}
async function createIntervention (intervention){

    const response= await apiClient("interventions/",{method:"POST",body:intervention});
    return response;

}

async function deleteIntervention(id) {
    const response = await apiClient("interventions/"+id,{method:"DELETE"});
    return response;
}

async function getTotalHoursPerCategory(){
    const response= await apiClient(`interventions/categories/hours`,{method:"GET"});
    return response;
}
async function getTotalAmountPerMonth(){
    const date = dayjs(new Date()).format("YYYY-MM-DD");
    const response= await apiClient(`interventions/monthlyAmount/` + date,{method:"GET"});
    return response;
}


async function getTotalExtraCostPerMonth(){
const date = dayjs(new Date()).format("YYYY-MM-DD");
    const response= await apiClient(`extraCosts/monthlyAmount/` + date,{method:"GET"});
    console.log("total",response);
    return response;
}

async function validatePayment(interventionId){
    const response= await apiClient(`interventions/validatePayment/${interventionId}`,{method:"PUT"});
    return response;
    
}



export default {
    getInterventions,
    deleteIntervention,
    createIntervention,
    getInterventionsByContractId,
    validateIntervention, 
    getByUserId,
    getByFormationAndUserId,
    getTotalHoursPerCategory,
    getTotalAmountPerMonth,
    getTotalExtraCostPerMonth,
    validatePayment,
    getById
}