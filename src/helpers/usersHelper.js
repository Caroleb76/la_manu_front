import apiClient from "./apiClient";


async function getUsers (offset=0,limit=10){

    const params= {
        offset,limit
    };
    // console.log(params);
    
    const response= await apiClient("users/",{method:"GET",params});
    // console.log(response)
    return response;

}

async function createUser (user){

    const response= await apiClient("users/",{method:"POST",body:user});
    return response;

}

async function blockUser (id,data){

    const response= await apiClient("users/block/"+id,{method:"PUT",body:data});
    return response;

}

export default {
    getUsers,
    createUser,
    blockUser
}