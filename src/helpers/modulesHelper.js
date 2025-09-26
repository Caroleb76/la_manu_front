import apiClient from "./apiClient";


async function getModules (){


    const response= await apiClient("moduleFormation/",{method:"GET"});
    return response;

}

async function getModuleByFormation (moduleId){

    const response= await apiClient("moduleFormation/formation/"+moduleId,{method:"GET"});
    return response;
}

async function create (formData){

    const response= await apiClient("moduleFormation", {
        method:"POST",
        body:formData
    }
    );
    return response;
}


export default {
    getModules,
    getModuleByFormation,
    create

}