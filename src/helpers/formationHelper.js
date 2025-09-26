import apiClient from "./apiClient";

async function getFormations() {
    // const params = {
    //     offset,
    //     limit,
    //     searchText,
    // };
    const response = await apiClient("formation/", { method: "GET" });
    return response;
}

async function allFormationByFormateurId(userId) {

    const response = await apiClient(`formation/formateur/${userId}`, { method: "GET" });
    return response;
}

async function createFormation(formation) {
    const response = await apiClient("formation/", {
        method: "POST",
        body: formation,
    });
    return response;
}

async function updateFormation(formation) {
    const response = await apiClient("formation/"+formation.id, {
        method: "PUT",
        body: formation,
    });
    return response;
}
export default {
    getFormations,
    createFormation,
    updateFormation,
    allFormationByFormateurId
};
