
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
    console.log(endpoint);
    
    const response =await fetch(endpoint, requestOptions);   
    const responseJson = await response.json();
    console.log(responseJson);
    
    return responseJson;
    

}


export {login};