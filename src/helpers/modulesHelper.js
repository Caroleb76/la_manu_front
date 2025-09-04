import apiClient from "./apiClient";


async function getModules (offset=0,limit=10,searchText=""){

    const params= {
        offset,limit,searchText
    };
    const response= await apiClient("moduleFormation/",{method:"GET",params});
    return response;

}

async function getModuleByFormation (moduleId){

    const response= await apiClient("moduleFormation/formation/"+moduleId,{method:"GET"});
    return response;
}


export default {
    getModules,
    getModuleByFormation

}