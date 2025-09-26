import apiClient from "./apiClient";


async function getContracts (){

    const response= await apiClient("contracts/",{method:"GET"});
    return response;
}

async function getContractsByUserId (id, offset=0,limit=10,searchText="",filter=null){

    const params= {
       id, offset,limit,searchText,filter
    };
    const response= await apiClient("contracts/user/"+id,{method:"GET",params});
    return response;
}

async function getContract (id){
    const response= await apiClient("contracts/"+id,{method:"GET"});
    return response;

}

async function createContract (contract){

    const response= await apiClient("contracts/",{method:"POST",body:contract});
    return response;

}


async function editContract (contract){

    const response= await apiClient("contracts/",{method:"POST",body:contract});
    return response;

}

async function signContract(contractId){
    const response= await apiClient("contracts/sign/"+contractId,{method:"PUT"});
    return response;
}



export default {
    getContracts,
    getContractsByUserId,
    getContract,
    createContract,
    editContract,
    signContract
}