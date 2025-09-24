import apiClient from "./apiClient";


async function getInterventions (offset=0,limit=10,searchText=""){

    const params= {
        offset,limit,searchText
    };
    const response= await apiClient("interventions/",{method:"GET",params});
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

    console.log("contractId",contractId);
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
    console.log(response);
    
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


export default {
    getInterventions,
    deleteIntervention,
    createIntervention,
    getInterventionsByContractId,
    validateIntervention, 
    getByUserId,
    getByFormationAndUserId
}