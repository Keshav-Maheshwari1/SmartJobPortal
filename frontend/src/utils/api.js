import axios from "axios";

const API = axios.create({
  baseURL: "/room",
});

export const getToken = (roomName, userName) =>
  API.post("/get-token", { roomName, userName });
