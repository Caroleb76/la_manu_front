import apiClient from "./apiClient";

async function getAll() {
  const response = await apiClient("extraCostsCategories/", { method: "GET" });
  return response;
}

export default {
  getAll,
};
