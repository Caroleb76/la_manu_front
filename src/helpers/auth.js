import { TOKEN_KEY } from "../utils/constants";

// api
const apiUrl= import.meta.env.VITE_API_URL;



async function  login (email,password){
    let endpoint = `${apiUrl}/auth/login`;
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({"email":email,"password":password});

    let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };
   
    
    const response =await fetch(endpoint, requestOptions);   
    const responseJson = await response.json();
    
    
    return responseJson;
    

}

async function authMe(){
    const token = localStorage.getItem(TOKEN_KEY);
    if(!token) return null;
    let endpoint = `${apiUrl}/auth/authMe`;
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    let requestOptions = {
    method: 'GET',
    headers: myHeaders
    };
    const response =await fetch(endpoint, requestOptions);   
    const responseJson = await response.json();
    
    
    return responseJson?.data;
}


export {login,authMe};