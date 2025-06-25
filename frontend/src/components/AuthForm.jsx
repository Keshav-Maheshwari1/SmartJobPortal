import React from "react";
import InputField from "./InputField";
import AuthButton from "./AuthButton";

const AuthForm = ({
  fields,
  onSubmit,
  buttonLabel,
  isLoading,
  errors,
  handleChange,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-gray-900 p-6 rounded-xl shadow-lg space-y-6"
    >
      <div
        className={`grid grid-cols-1 gap-4 ${
          fields.length > 6 ? "md:grid-cols-2" : ""
        }`}
      >
        {fields.map((field) => (
          <InputField
            key={field.name}
            label={field.label}
            type={field.type}
            name={field.name}
            value={field.value}
            onChange={handleChange}
            error={errors[field.name]}
            isPassword={field.isPassword}
            required={field.required}
          />
        ))}
      </div>

      <div className="pt-2">
        <AuthButton label={buttonLabel} isLoading={isLoading} type="submit" />
      </div>
    </form>
  );
};

export default AuthForm;
