import apiClient from "./apiClient";


async function getExtraCosts (offset=0,limit=10,searchText=""){

    const params= {
        offset,limit,searchText
    };
    const response= await apiClient("extraCosts/",{method:"GET",params});
    return response;

}

async function create (extraCost){

    const response= await apiClient("extraCosts/",{method:"POST",body:extraCost});
    return response;

}

async function update (extraCost,id){

    const response= await apiClient(`extraCosts/${id}`,{method:"PUT",body:extraCost});
    return response;

}

async function getExtraCostsByInterventionId (interventionId){

    const response= await apiClient(`extraCosts/intervention/${interventionId}`,{method:"GET"});    
    return response;
    
}

async function destroy(id) {
    const response = await apiClient("extraCosts/"+id,{method:"DELETE"});
    return response;
}


export default {
    getExtraCosts,
    create,
    getExtraCostsByInterventionId,
    destroy,
    update,
    // createIntervention
}