import React, { useState } from "react";
import AuthForm from "../components/AuthForm"; // adjust path as needed

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fields = [
    {
      label: "Name",
      type: "text",
      name: "name",
      value: formData.name,
    },
    {
      label: "Email",
      type: "email",
      name: "email",
      value: formData.email,
    },
    {
      label: "Message",
      type: "textarea",
      name: "message",
      value: formData.message,
    },
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.message) newErrors.message = "Message is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Handle submission logic here
    setTimeout(() => {
      alert("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-xl w-full max-w-6xl">
        {/* Left: Form */}
        <div>
          <h2 className="text-3xl font-bold text-white text-center mb-2">
            Contact Me
          </h2>
          <p className="text-gray-300 mb-6 text-center">
            I'd love to hear from you!
          </p>
          <AuthForm
            fields={fields}
            onSubmit={handleSubmit}
            buttonLabel="Send Message"
            isLoading={isLoading}
            errors={errors}
            handleChange={handleChange}
          />
        </div>

        {/* Right: Image / Info */}
        <div className="flex flex-col justify-center items-center text-white text-center space-y-6">
          <img
            src="https://assets.entrepreneur.com/content/3x2/2000/20150823040038-shutterstock-141719248.jpeg"
            alt="Contact"
            className="rounded-xl shadow-lg w-full max-w-sm object-cover"
          />
          <div>
            <h3 className="text-xl font-semibold">Reach Me</h3>
            <p>Email: smartHire@contact.com</p>
            <p>Phone: +91 99933XXXXX</p>
            <p>Location: India (Remote)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
