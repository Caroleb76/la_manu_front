import apiClient from "./apiClient";

async function getNotifications() {
  const response = await apiClient("notification/", { method: "GET" });
  return response;
}

async function createNotification(notification) {
  const response = await apiClient("notification/", {
    method: "POST",
    body: notification,
  });
  return response;
}

async function deleteNotification(id) {
  const response = await apiClient("notification/" + id, { method: "DELETE" });
  return response;
}

export default {
  getNotifications,
  deleteNotification,
  createNotification,
};
