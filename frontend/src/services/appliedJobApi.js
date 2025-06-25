import axios from "axios";
import BASEURL from "../constants/BaseURL";

const getAuthToken = () => {
  return localStorage.getItem("accessToken");
};

export const applyForJob = async (applicant) => {
  const token = getAuthToken();
  const response = await axios.post(
    `${BASEURL}/api/applied-jobs/apply`,
    applicant, // send full applicant object as request body
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Function to update the application status
export const updateApplicationStatus = async ({
  applicantEmail,
  jobId,
  status,
}) => {
  const token = getAuthToken();
  const response = await axios.put(
    `${BASEURL}/api/applied-jobs/update-status`,
    null,
    {
      params: { applicantEmail, jobId, status },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
export const sendOfferLetter = async (payload) => {
  const token = getAuthToken();
  const response = await axios.post(`${BASEURL}/api/job-offers/send`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const sendRoomIdToApplicant = async ({
  hrEmail,
  jobId,
  applicantEmail,
  roomId,
  time,
}) => {
  const token = getAuthToken();
  if (!token) {
    return "token is not defined";
  }
  const response = await axios.post(`${BASEURL}/api/applied-jobs/user`, null, {
    params: { hrEmail, jobId, applicantEmail, roomId, time },
    headers: {
      Authorization: `Bearer ${token}`, // Add JWT token to the headers
    },
  });
  return response.data;
};

export const sendWithDrawRequest = async (id) => {
  const token = getAuthToken();
  const response = await axios.delete(`${BASEURL}/api/applied-jobs/withdraw`, {
    params: { id },
    headers: {
      Authorization: `Bearer ${token}`, // Add JWT token to the headers
    },
  });
  return response.data;
};

// Function to get all accepted applicants for a job
export const getAcceptedApplicantsByJobId = async (jobId) => {
  const token = getAuthToken();
  const response = await axios.get(
    `${BASEURL}/api/applied-jobs/hr/job/${jobId}/accepted`,
    {
      headers: {
        Authorization: `Bearer ${token}`, // Add JWT token to the headers
      },
    }
  );
  return response.data;
};

export const getApplicantsByHrEmail = async (email) => {
  const token = getAuthToken();
  const response = await axios.get(
    `${BASEURL}/api/applied-jobs/applicants/${email}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Function to get applied jobs by applicant's email
export const getAppliedJobsByApplicantEmail = async (email) => {
  const token = getAuthToken();
  const response = await axios.get(`${BASEURL}/api/applied-jobs/user`, {
    params: { email },
    headers: {
      Authorization: `Bearer ${token}`, // Add JWT token to the headers
    },
  });
  return response.data;
};
