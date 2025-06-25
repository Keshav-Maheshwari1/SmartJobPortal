import React, { useState } from "react";

import AuthCard from "../components/AuthCard";
import AuthForm from "../components/AuthForm";
import { useSignIn } from "../customHooks/useAuth";
import { useNavigate } from "react-router-dom";
import { login } from "../assets";
import AnimatedSection from "../components/AnimatedSection";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { mutate: signInUser, isLoading } = useSignIn();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signInUser(formData, {
      onSuccess: () => navigate("/", { state: { from: "login" } }),
      onError: (err) => {
        let message = "Invalid credentials";
        if (err?.response?.status === 404) {
          message = "No user found with this email. Please sign up.";
        } else if (err?.response?.status === 401) {
          message = "Incorrect password. Please try again.";
        }else if(err?.response?.status === 409){
          message = "User Already Exist please login"
        }
        setErrors({ general: message });
      },
    });
  };

  const fields = [
    { label: "Email", type: "email", name: "email", value: formData.email },
    {
      label: "Password",
      type: "password",
      name: "password",
      value: formData.password,
      isPassword: true,
    },
  ];

  return (
    <div className="h-fit flex items-center justify-center bg-gray-900 px-4 md:p-32">
      <AnimatedSection className="flex md:flex-row items-center gap-8 bg-gray-800 md:p-8 rounded-xl shadow-lg w-full max-w-5xl">
        {/* Image */}
        <img
          src={login}
          alt="Profile"
          className=" hidden md:block w-full md:w-1/2 h-auto rounded-lg object-cover"
        />
        <AuthCard
          title="Login"
          footerText="Don't have an account?"
          footerLink="/signup"
          footerLinkText="Sign Up"
        >
          <AuthForm
            fields={fields}
            onSubmit={handleSubmit}
            buttonLabel="Sign In"
            isLoading={isLoading}
            errors={errors}
            handleChange={handleChange}
          />
          {errors.general && (
            <p className="text-red-500 text-center mt-2">{errors.general}</p>
          )}
        </AuthCard>
      </AnimatedSection>
    </div>
  );
};

export default LoginPage;
