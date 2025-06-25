import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const InputField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  isPassword = false,
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword && showPassword ? "text" : type;
  const isCheckbox = type === "checkbox";
  const isTextarea = type === "textarea";
  const isFile = type === "file";

  return (
    <div className="flex flex-col space-y-1">
      {isCheckbox ? (
        <label className="inline-flex items-center space-x-2 mt-2">
          <input
            type="checkbox"
            name={name}
            checked={!!value}
            onChange={(e) =>
              onChange({ target: { name, value: e.target.checked } })
            }
            className="form-checkbox h-5 w-5 text-purple-600"
          />
          <span className="text-white text-sm">{label}</span>
        </label>
      ) : (
        <>
          <label htmlFor={name} className="text-sm text-gray-300">
            {label}
          </label>
          <div className="relative">
            {isTextarea ? (
              <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                rows={3}
                required={required}
                className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <input
                id={name}
                name={name}
                type={inputType}
                value={!isFile ? value : undefined}
                onChange={onChange}
                accept={isFile ? "application/pdf" : undefined}
                required={required}
                className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}

            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none bg-gray-800"
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-300 bg-none" />
                ) : (
                  <FaEye className="text-gray-300 bg-none" />
                )}
              </button>
            )}
          </div>
        </>
      )}

      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
};

export default InputField;
