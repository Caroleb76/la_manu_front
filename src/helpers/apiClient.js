import { TOKEN_KEY } from "../utils/constants";

// api
const apiUrl= import.meta.env.VITE_API_URL;


async function apiClient(endpoint,{method="GET",headers=[],body,params}={}){
    const url = `${apiUrl}/${endpoint}`;

    const token= localStorage.getItem(TOKEN_KEY);

    if(params){
        const query= new URLSearchParams(params).toString();
        url+= `?${query}`;
    }

    const config={
        method,
        headers:{
            "Content-Type":"application/json",
            "Authorization": `Bearer ${token}`,
            ...headers
        },
        body: body? JSON.stringify(body) : undefined
    };

    try {
        const response = await fetch(url,config);
        // if(!response.ok){
        //     const errorData=await response.json();
        //     throw new Error(errorData.data.message??"API Error");
        // }
        const json= await response.json();
        return json;
    } catch (error) {
        console.error(`API Error [${method} ${url}]:`,error);
        throw error;
    }
}

export default apiClient;