import apiClient from "./apiClient";


async function getSessions (offset=0,limit=10){

    const params= {
        offset,limit
    };
    const response= await apiClient("SessionFormation/",{method:"GET",params});
    return response;

}


export default {
     getSessions
}