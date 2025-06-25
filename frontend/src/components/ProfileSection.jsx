import { useState, useEffect } from "react";

import { useFetchUser, useUpdateUser } from "../customHooks/useAuth";
import AuthForm from "../components/AuthForm";
import Loading from "./Loading";
import { profile } from "../assets";

const ProfileSection = ({ userEmail, Role }) => {
  const { data: user, isLoading } = useFetchUser(userEmail);
  const updateUser = useUpdateUser();

  const [form, setForm] = useState({
    companyName: Role.toLowerCase() === "hr" ? "" : "none",
    gitHubUrl: "",
    linkedInUrl: "",
    panCard: "",
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        companyName: user.companyName || "",
        gitHubUrl: user.gitHubUrl || "",
        linkedInUrl: user.linkedInUrl || "",
        panCard: user.panCard || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear field error on change
    setAlert(null); // Reset alert on change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlert(null);
    updateUser.mutate(
      { email: userEmail, ...form },
      {
        onSuccess: () => {
          setAlert({
            type: "success",
            message: "Profile updated successfully.",
          });
        },
        onError: (err) => {
          console.log(err);
          const backendMessage =
            err?.response?.data?.message ||
            "Something went wrong. Please try again.";
          setAlert({ type: "error", message: backendMessage });
          if (backendMessage.includes("GitHub")) {
            setErrors((prev) => ({ ...prev, gitHubUrl: backendMessage }));
          } else if (backendMessage.includes("LinkedIn")) {
            setErrors((prev) => ({ ...prev, linkedInUrl: backendMessage }));
          } else if (backendMessage.includes("PAN")) {
            setErrors((prev) => ({ ...prev, panCard: backendMessage }));
          }
        },
      }
    );
  };

  const isComplete = form.gitHubUrl && form.linkedInUrl && form.panCard;

  const fields = [
    {
      label: "GitHub URL",
      name: "gitHubUrl",
      type: "text",
      value: form.gitHubUrl,
    },
    {
      label: "LinkedIn URL",
      name: "linkedInUrl",
      type: "text",
      value: form.linkedInUrl,
    },
    {
      label: "PAN Card",
      name: "panCard",
      type: "text",
      value: form.panCard,
    },
  ];
  if (Role.toLowerCase() === "hr") {
    fields.push({
      label: "Company Name",
      name: "companyName",
      type: "text",
      value: form.companyName,
    });
  }

  if (isLoading || !user) {
    return <Loading />;
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-2xl shadow-2xl max-w-lg mx-auto text-center">
      <img
        src={profile}
        alt="Profile"
        className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-purple-500 shadow-lg"
      />
      <h2 className="text-2xl text-white font-bold mb-1">
        Welcome to your dashboard!
      </h2>
      <p className="text-gray-400">Email: {userEmail}</p>
      <span className="mt-2 inline-block bg-purple-700 text-white text-sm px-4 py-1 rounded-full shadow">
        Role: {Role}
      </span>

      <div className="mt-6 text-left">
        {alert && (
          <div
            className={`text-sm mb-4 rounded px-3 py-2 ${
              alert.type === "error"
                ? "bg-red-700 text-red-100"
                : "bg-green-700 text-green-100"
            }`}
          >
            {typeof alert.message === "object"
              ? alert.message.message
              : alert.message}
          </div>
        )}

        <AuthForm
          fields={fields}
          onSubmit={handleSubmit}
          buttonLabel="Update Profile"
          isLoading={updateUser.isLoading}
          errors={errors}
          handleChange={handleChange}
        />
      </div>

      {!isComplete && (
        <p className="text-red-500 mt-4 text-sm">
          Please complete your profile to{" "}
          {Role === "HR" ? "post jobs" : "apply for jobs"}.
        </p>
      )}
    </div>
  );
};

export default ProfileSection;
