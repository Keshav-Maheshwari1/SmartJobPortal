import React, { useState } from "react";
import AuthForm from "./AuthForm";
import { useCreateJob } from "../customHooks/useJob";

import Loading from "./Loading";
import { useIsProfileComplete } from "../customHooks/useAuth";

const PostJobForm = ({ email }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eligibility: "",
    category: "",
    type: "Full-Time",
    location: "",
    experienceLevel: "Entry",
    skills: "",
    isRemote: false,
    salary: "",
    deadline: "",
    tags: "",
  });

  const [errors, setErrors] = useState({});
  const { mutate: createJob, isLoading: isCreating } = useCreateJob();
  const { isComplete, isLoading: isProfileLoading } =
    useIsProfileComplete(email);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.deadline) {
      setErrors({ deadline: "Deadline is required." });
      return;
    }

    // Convert comma-separated fields to arrays
    const skillsArray = formData.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const tagsArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    createJob(
      {
        ...formData,
        skills: skillsArray,
        tags: tagsArray,
        email,
      },
      {
        onSuccess: () => {
          setFormData({
            title: "",
            description: "",
            eligibility: "",
            category: "",
            type: "Full-Time",
            location: "",
            experienceLevel: "Entry",
            skills: "",
            isRemote: false,
            salary: "",
            deadline: "",
            tags: "",
          });
          setErrors({ success: "Job posted successfully!" });
        },
        onError: (err) => {
          const message = err?.response?.data || "Failed to post job.";
          setErrors({ general: message });
        },
      }
    );
  };

  if (isProfileLoading) return <Loading />;

  if (!isComplete) {
    return (
      <div className="text-center text-red-500 font-medium mt-6">
        ⚠️ Please complete your profile (GitHub, LinkedIn, PAN) before posting a
        job.
      </div>
    );
  }

  const fields = [
    { label: "Job Title", name: "title", type: "text", value: formData.title },
    {
      label: "Category",
      name: "category",
      type: "text",
      value: formData.category,
    },
    {
      label: "Description",
      name: "description",
      type: "textarea",
      value: formData.description,
    },
    {
      label: "Eligibility",
      name: "eligibility",
      type: "textarea",
      value: formData.eligibility,
    },
    {
      label: "Job Type",
      name: "type",
      type: "text",
      value: formData.type,
    },
    {
      label: "Location",
      name: "location",
      type: "text",
      value: formData.location,
    },
    {
      label: "Experience Level",
      name: "experienceLevel",
      type: "text",
      value: formData.experienceLevel,
    },
    {
      label: "Skills (comma-separated)",
      name: "skills",
      type: "text",
      value: formData.skills,
    },
    {
      label: "Tags (comma-separated)",
      name: "tags",
      type: "text",
      value: formData.tags,
    },
    {
      label: "Remote",
      name: "isRemote",
      type: "checkbox",
      value: formData.isRemote,
    },
    {
      label: "Salary (LPA)",
      name: "salary",
      type: "text",
      value: formData.salary,
    },
    {
      label: "Deadline",
      name: "deadline",
      type: "datetime-local",
      value: formData.deadline,
    },
  ];

  return (
    <div>
      <AuthForm
        fields={fields}
        onSubmit={handleSubmit}
        buttonLabel="Post Job"
        isLoading={isCreating}
        errors={errors}
        handleChange={handleChange}
      />
      {errors.success && (
        <p className="text-green-500 text-center mt-2">{errors.success}</p>
      )}
      {errors.general && (
        <p className="text-red-500 text-center mt-2">{errors.general}</p>
      )}
    </div>
  );
};

export default PostJobForm;
