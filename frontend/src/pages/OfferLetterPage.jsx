import React, { useState } from "react";
import { useParams } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import AuthForm from "../components/AuthForm";
import { useSendOfferLetter } from "../customHooks/useAppliedJob";

const OfferLetterPage = () => {
  const { applicantEmail, jobId } = useParams();

  const { mutateAsync, isPending, isError, error } = useSendOfferLetter({
    onSuccess: () => {
      alert("Offer sent successfully");
      window.location.reload();
    },
  });

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    salary: "",
    offerDate: today,
    bonus: "",
    benefits: "",
    employmentType: "",
    noticePeriod: "",
    probationPeriod: "",
  });

  const [errors, setErrors] = useState({});

  const fields = [
    {
      label: "Salary",
      name: "salary",
      type: "text",
      value: form.salary,
      required: true,
    },
    {
      label: "Offer Date",
      name: "offerDate",
      type: "date",
      value: form.offerDate,
      required: true,
    },
    { label: "Bonus", name: "bonus", type: "text", value: form.bonus },
    { label: "Benefits", name: "benefits", type: "text", value: form.benefits },
    {
      label: "Employment Type",
      name: "employmentType",
      type: "text",
      value: form.employmentType,
      required: true,
    },
    {
      label: "Notice Period (days)",
      name: "noticePeriod",
      type: "number",
      value: form.noticePeriod,
      required: true,
    },
    {
      label: "Probation Period",
      name: "probationPeriod",
      type: "text",
      value: form.probationPeriod,
    },
  ];

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    fields.forEach((f) => {
      if (f.required && !form[f.name]) newErrors[f.name] = "Required";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = { applicantEmail, jobId, ...form };

    try {
      await mutateAsync(payload);
    } catch (err) {
      console.error("Failed to send offer letter:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <AuthCard title="Generate Offer Letter">
        {isError && (
          <div className="text-red-500 mb-2">
            {error?.message || "Something went wrong"}
          </div>
        )}
        <AuthForm
          fields={fields}
          onSubmit={handleSubmit}
          buttonLabel={isPending ? "Sending..." : "Send Offer Letter"}
          isLoading={isPending}
          errors={errors}
          handleChange={handleChange}
        />
      </AuthCard>
    </div>
  );
};

export default OfferLetterPage;
