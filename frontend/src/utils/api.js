import axios from "axios";

const API = axios.create({
  baseURL: "https://smart-job-portal-iota.vercel.app",
});

export const getToken = (roomName, userName) =>
  API.post("/get-token", { roomName, userName });
