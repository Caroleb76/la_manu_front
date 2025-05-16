import apiClient from "./apiClient";



async function  login (email,password){

    const body ={"email":email,"password":password};
    const response =await apiClient("auth/login",{method:"POST",body});
    return response;
    

}

async function authMe(){

    const response =await apiClient("auth/authMe",{method:"GET"});
    return response.data;
}


export {login,authMe};