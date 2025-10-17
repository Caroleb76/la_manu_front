import apiClient from "./apiClient";


async function getModules (){


    const response= await apiClient("moduleFormation/",{method:"GET"});
    return response;

}

async function getModuleByFormation (moduleId){

    const response= await apiClient("moduleFormation/formation/"+moduleId,{method:"GET"});
    return response;
}

async function createModule (formData){

    const response= await apiClient("moduleFormation", {
        method:"POST",
        body:formData
    }
    );
    return response;
}
async function updateModule(module) {
    const response = await apiClient(`moduleFormation/${module.id}`, {
        method: "PUT",
        body: module,
    });
    return response;
}

export default {
    getModules,
    getModuleByFormation,
    updateModule,
    createModule

}