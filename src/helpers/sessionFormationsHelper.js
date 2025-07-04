import apiClient from "./apiClient";


async function getSessions (offset=0,limit=10){

    const params= {
        offset,limit
    };
    const response= await apiClient("SessionFormation/",{method:"GET",params});
    return response;

}


async function getSessionById (sessionId){

    const response= await apiClient(`SessionFormation/${sessionId}`,{method:"GET"});
    return response;

}

async function createSessionFormation(sessionFormation){

    const response= await apiClient("SessionFormation/",{method:"POST",body:sessionFormation});
    return response;
    
}
async function updateSessionFormation(sessionFormation){
    console.log("SessionFormation from helper",sessionFormation);
    const response= await apiClient(`SessionFormation/${sessionFormation.id}`,{method:"PUT",body:sessionFormation});
    return response;
    
}


export default {
     getSessions,
     getSessionById,
     createSessionFormation,
     updateSessionFormation
}