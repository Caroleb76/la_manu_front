import apiClient from "./apiClient";


async function getNotifications (offset=0,limit=10){

    const params= {
        offset,limit
    };
    const response= await apiClient("notification/",{method:"GET",params});
    return response;

}


export default {
    getNotifications
}