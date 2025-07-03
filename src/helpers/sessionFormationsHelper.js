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


export default {
     getSessions,
     getSessionById,
}