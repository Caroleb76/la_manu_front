import apiClient from "./apiClient";

async function getAddresses(offset = 0, limit = 10, searchText = "") {
  const params = {
    offset,
    limit,
    searchText,
  };
  const response = await apiClient("addresses/", { method: "GET", params });
  return response;
}

async function createAddress(address) {
  const response = await apiClient("addresses/", {
    method: "POST",
    body: address,
  });
  return response;
}

export default {
  createAddress,
  getAddresses,
};
