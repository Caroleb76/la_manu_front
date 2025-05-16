import apiClient from "./apiClient";


async function getUsers (offset=0,limit=10){

    const params= {
        offset,limit
    };
    const response= await apiClient("users/",{method:"GET",params});
    return response;

}


export default {
    getUsers
}