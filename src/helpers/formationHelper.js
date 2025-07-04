import apiClient from "./apiClient";

async function getFormations (offset=0,limit=10,searchText=""){
    const params= {
        offset,limit,searchText
    };
    const response= await apiClient("formation/",{method:"GET",params});
    return response;

}

export default {getFormations};
