import apiClient from "./apiClient";


async function getContracts (offset=0,limit=10,searchText=""){

    const params= {
        offset,limit,searchText
    };
    const response= await apiClient("contracts/",{method:"GET",params});
    return response;

}

async function createContract (contract){

    const response= await apiClient("contracts/",{method:"POST",body:contract});
    return response;

}



export default {
    getContracts,
    createContract
}