import apiClient from "./apiClient";


const server = import.meta.env.VITE_SERVER_URL;
async function uploadFile(file) {

    const response = await apiClient("files/", { method: "POST", body: file });
    return response;

}

async function getUserFiles(userId) {

    const response = await apiClient(`files/${userId}/getAll`, { method: "GET" });
    return response;

}

async function getExtraCostFiles(userId,extraCostId) {

    const response = await apiClient(`files/${userId}/${extraCostId}/getAll`, { method: "GET" });
    return response;

}

async function downloadFile(fullPath,fileName) {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${server}${fullPath}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    
    if (!response.ok) {
        
        throw new Error("Download failed");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

async function deleteFile(id) {
    const response = await apiClient(`files/${id}`, { method: "DELETE" });
    return response;
}

export default {
    uploadFile,
    getUserFiles,
    downloadFile,
    deleteFile,
    getExtraCostFiles
}