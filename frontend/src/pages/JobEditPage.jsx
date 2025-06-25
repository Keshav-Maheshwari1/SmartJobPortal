import { useParams, useNavigate } from "react-router-dom";
import {
  useUpdateJob,
  useDeleteJob,
  useFetchJobById,
} from "../customHooks/useJob";
import { useState, useEffect } from "react";
import InputField from "../components/InputField";
import AuthButton from "../components/AuthButton";

const JobEditPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");

  const { data: job } = useFetchJobById(jobId);
  const [formData, setFormData] = useState({});

  const { mutate: update } = useUpdateJob();
  const { mutate: remove } = useDeleteJob();

  useEffect(() => {
    if (job) {
      setFormData({
        ...job,
        isRemote: !!job.isRemote, // <-- ensure boolean
      });
    }
  }, [job]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleUpdate = () => {
    update(
      { updatedJob: formData, email },
      { onSuccess: () => navigate("/profile/hr") }
    );
  };

  const handleDelete = () =>
    remove({ jobId, email }, { onSuccess: () => navigate("/profile/hr") });

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

  if (!job) return <p className="text-gray-400">Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-gray-900 rounded-lg space-y-4">
      {fields.map(({ label, type, name, value }) => (
        <InputField
          key={name}
          label={label}
          type={type}
          name={name}
          value={value || ""}
          onChange={handleChange}
        />
      ))}

      <div className="flex gap-4 justify-end">
        <AuthButton label="Update" onClick={handleUpdate} />
        <AuthButton label="Delete" onClick={handleDelete} />
      </div>
    </div>
  );
};

export default JobEditPage;
