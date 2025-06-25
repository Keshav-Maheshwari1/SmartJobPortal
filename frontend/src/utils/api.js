import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

export const getToken = (roomName, userName) =>
  API.post("/get-token", { roomName, userName });
