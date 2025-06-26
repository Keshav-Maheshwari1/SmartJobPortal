import axios from "axios";

const API = axios.create({
  baseURL: "https://smartjobportal.onrender.com",
});

export const getToken = (roomName, userName) =>
  API.post("/get-token", { roomName, userName });
