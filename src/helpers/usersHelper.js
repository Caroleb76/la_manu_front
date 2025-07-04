import apiClient from "./apiClient";


async function getUsers (props){
    // offset=0,limit=10,searchText="",role=null

    let params = {
            offset: props.offset ?? 0,
            limit: props.limit ?? 10,
            role: props?.role ?? null,
            searchText: props.searchText ?? null
};
if(!props.role){
    delete params.role
}
if(!props.searchText){
    delete params.searchText

}

    console.log("the params of searching users are",params);
    
    const response= await apiClient("users/",{method:"GET",params});
    // console.log(response)
    return response;

}
async function getUserById (userId){
   
    
    const response= await apiClient(`users/${userId}`,{method:"GET"});
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
    blockUser,
    getUserById,
}