import { TOKEN_KEY } from "../utils/constants";

// api
const apiUrl = import.meta.env.VITE_API_URL;


async function apiClient(endpoint, { method = "GET", headers = [], body, params } = {}) {
    let url = `${apiUrl}/${endpoint}`;

    const token = localStorage.getItem(TOKEN_KEY);

    if (params) {
        const query = new URLSearchParams(params).toString();
        url += `?${query}`;
    }

    const config = {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...headers
        },
        body: body ? body instanceof FormData  ? body : JSON.stringify(body) : undefined
    };
    if (config.body instanceof FormData) {
        delete config.headers['Content-Type'];
    }
    try {
        const response = await fetch(url, config);
        // console.log(response);
        if(response.status === 401) {
            localStorage.removeItem(TOKEN_KEY);
            window.location.reload();
        }
        const json = await response.json();
        return json;
    } catch (error) {
        console.error(`API Error [${method} ${url}]:`, error);
        throw error;
    }
}

export default apiClient;