import apiClient from "./apiClient";


async function getRoles (){


    const response= await apiClient("roles/",{method:"GET"});
    return response;

}

export default {getRoles};