import apiClient from "./apiClient";


async function getModules (offset=0,limit=10,searchText=""){

    const params= {
        offset,limit,searchText
    };
    const response= await apiClient("moduleFormation/",{method:"GET",params});
    return response;

}

// async function createIntervention (intervention){

//     const response= await apiClient("intervention/",{method:"POST",body:intervention});
//     return response;

// }

// async function deleteIntervention(id) {
//     const response = await apiClient("intervention/"+id,{method:"DELETE"});
//     return response;
// }


export default {
    getModules,
    // deleteIntervention,
    // createIntervention
}