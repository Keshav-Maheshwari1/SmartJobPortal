import React, { useState } from "react";
import { useParams } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import AuthForm from "../components/AuthForm";
import { useSendOfferLetter } from "../customHooks/useAppliedJob";

const OfferLetterPage = () => {
  const { applicantEmail, jobId } = useParams();
  const { mutate: sendOfferLetter, isLoading } = useSendOfferLetter({
    onSuccess: () => {
      console.log("offer letter sent");
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required && !form[field.name]) {
        newErrors[field.name] = "Required";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      applicantEmail,
      jobId,
      ...form,
    };

    sendOfferLetter(payload);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <AuthCard title="Generate Offer Letter">
        <AuthForm
          fields={fields}
          onSubmit={handleSubmit}
          buttonLabel="Send Offer Letter"
          isLoading={isLoading}
          errors={errors}
          handleChange={handleChange}
        />
      </AuthCard>
    </div>
  );
};

export default OfferLetterPage;
