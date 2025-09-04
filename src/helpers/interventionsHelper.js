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

async function createIntervention (intervention){

    const response= await apiClient("intervention/",{method:"POST",body:intervention});
    return response;

}

async function deleteIntervention(id) {
    const response = await apiClient("intervention/"+id,{method:"DELETE"});
    return response;
}


export default {
    getInterventions,
    deleteIntervention,
    createIntervention, 
    getByUserId
}