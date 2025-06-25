import React, { useState } from "react";
import { useParams } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import AuthForm from "../components/AuthForm";
import { useApplyForJob } from "../customHooks/useAppliedJob";
import { useIsProfileComplete } from "../customHooks/useAuth";
import Loading from "../components/Loading";

const ApplyJobFormPage = () => {
  const { jobId } = useParams();
  const email = localStorage.getItem("userEmail");
  const { isComplete, isLoading, gitHubUrl, linkedInUrl, panCard } =
    useIsProfileComplete(email);

  const [formData, setFormData] = useState({
    resume: "",
    portfolioUrl: "",
    expectedSalary: "",
    noticePeriod: "",
    currentLocation: "",
    experienceLevel: "",
  });

  const [errors, setErrors] = useState({});
  const { mutate: apply, isLoading: isSubmitting } = useApplyForJob();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (!formData.resume || !formData.resume.includes("drive.google.com")) {
        throw new Error("Please provide a valid Google Drive resume link.");
      }

      apply(
        {
          applicantEmail: email,
          resumeUrl: formData.resume,
          jobId,
          portfolioUrl: formData.portfolioUrl,
          expectedSalary: formData.expectedSalary,
          noticePeriod: formData.noticePeriod,
          currentLocation: formData.currentLocation,
          experienceLevel: formData.experienceLevel,
        },
        {
          onSuccess: () => {
            setFormData({
              resume: "",
              portfolioUrl: "",
              expectedSalary: "",
              noticePeriod: "",
              currentLocation: "",
              experienceLevel: "",
            });
            alert("✅ Application submitted successfully!");
            setTimeout(() => window.location.reload(), 100);
          },
          onError: (error) => {
            const serverMessage =
              error?.response?.data?.message ||
              error?.response?.data ||
              error?.message ||
              "Something went wrong. Please try again.";
            setErrors({ general: serverMessage });
          },
        }
      );
    } catch (error) {
      setErrors({ general: error.message || "Something went wrong." });
    }
  };

  const fields = [
    {
      label: "Resume URL (Google Drive)",
      type: "url",
      name: "resume",
      value: formData.resume,
      required: true,
    },
    {
      label: "Portfolio URL (optional)",
      type: "url",
      name: "portfolioUrl",
      value: formData.portfolioUrl,
      required: false,
    },
    {
      label: "Expected Salary (₹/month)",
      type: "number",
      name: "expectedSalary",
      value: formData.expectedSalary,
      required: false,
    },
    {
      label: "Notice Period / Availability",
      type: "text",
      name: "noticePeriod",
      value: formData.noticePeriod,
      required: false,
    },
    {
      label: "Current Location",
      type: "text",
      name: "currentLocation",
      value: formData.currentLocation,
      required: true,
    },
    {
      label: "Experience Level",
      type: "select",
      name: "experienceLevel",
      value: formData.experienceLevel,
      options: ["", "Fresher", "0–1 years", "1–3 years", "3+ years"],
      required: true,
    },
  ];

  if (isLoading) return <Loading />;
  if (isSubmitting) return <Loading />;

  if (!isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <AuthCard title="Profile Incomplete">
          <p className="text-red-400 text-sm text-center">
            ⚠️ Please complete your profile (GitHub, LinkedIn, PAN) before
            applying for jobs.
          </p>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <AuthCard title="Apply for Job">
        {/* Read-only Profile Info */}
        <div className="bg-gray-800 text-gray-200 text-sm p-4 rounded mb-4">
          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>PAN Card:</strong> {panCard}
          </p>
          <p>
            <strong>GitHub:</strong>{" "}
            <a
              href={gitHubUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 underline"
            >
              {gitHubUrl}
            </a>
          </p>
          <p>
            <strong>LinkedIn:</strong>{" "}
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 underline"
            >
              {linkedInUrl}
            </a>
          </p>
        </div>

        <AuthForm
          fields={fields}
          onSubmit={handleSubmit}
          buttonLabel="Submit Application"
          isLoading={isSubmitting}
          errors={errors}
          handleChange={handleChange}
        />

        {errors.success && (
          <p className="text-green-500 text-center mt-2">{errors.success}</p>
        )}
        {errors.general && (
          <p className="text-red-500 text-center mt-2">{errors.general}</p>
        )}
      </AuthCard>
    </div>
  );
};

export default ApplyJobFormPage;
