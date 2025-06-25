import { Link } from "react-router-dom";

const AuthCard = ({
  title,
  children,
  footerLink,
  footerText,
  footerLinkText,
}) => {
  return (
    <div className="max-w-4xl w-full mx-auto bg-gray-800 rounded-xl shadow-lg p-8">
      {title && (
        <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">
          {title}
        </h2>
      )}

      {children}

      {footerText && footerLink && (
        <p className="mt-6 text-center text-gray-400">
          {footerText}{" "}
          <Link to={footerLink} className="text-blue-500 hover:underline">
            {footerLinkText}
          </Link>
        </p>
      )}
    </div>
  );
};

export default AuthCard;
