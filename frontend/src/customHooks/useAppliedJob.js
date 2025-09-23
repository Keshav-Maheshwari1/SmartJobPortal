import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  applyForJob,
  updateApplicationStatus,
  getAcceptedApplicantsByJobId,
  getAppliedJobsByApplicantEmail,
  getApplicantsByHrEmail,
  sendRoomIdToApplicant,
  sendOfferLetter,
  sendWithDrawRequest,
} from "../services/appliedJobApi";

export const useApplyForJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyForJob,
    onSuccess: () => {
      queryClient.invalidateQueries(["appliedJobs"]);
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateApplicationStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["appliedJobs", data]);
    },
  });
};

export const useWithDrawApplicant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendWithDrawRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appliedJobs"] });
    },
  });
};

export const useSendOfferLetter = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendOfferLetter,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["jobOffers"] });
      queryClient.invalidateQueries({ queryKey: ["appliedJobs"] });

      if (options.onSuccess) options.onSuccess(...args);
    },
    onError: (...args) => {
      if (options.onError) options.onError(...args);
    },
    ...options,
  });
};
export const useSendRoomIdToApplicant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendRoomIdToApplicant,
    onSuccess: () => {
      queryClient.invalidateQueries(["appliedJobs"]);
    },
  });
};

export const useGetAcceptedApplicantsByJobId = (jobId) =>
  useQuery({
    queryKey: ["acceptedApplicants", jobId],
    queryFn: () => getAcceptedApplicantsByJobId(jobId),
    enabled: !!jobId,
  });

export const useGetAppliedJobsByApplicantEmail = (email) =>
  useQuery({
    queryKey: ["appliedJobs", email],
    queryFn: () => getAppliedJobsByApplicantEmail(email),
    enabled: !!email,
  });

export const useGetApplicantsByHrEmail = (email) => {
  return useQuery({
    queryKey: ["appliedJobs", email],
    queryFn: () => getApplicantsByHrEmail(email),
    enabled: !!email,
  });
};
