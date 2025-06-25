import { Navigate } from "react-router-dom";

import AuthCard from "../components/AuthCard";
import PostJobForm from "../components/PostJobForm";
import { useFetchUser } from "../customHooks/useAuth";
import Loading from "../components/Loading";

const PostJobPage = () => {
  const email = localStorage.getItem("userEmail") || "";
  const { data: user, isLoading } = useFetchUser(email);

  if (isLoading) {
    return <Loading />;
  }

  if (!user || user.role !== "HR") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <AuthCard
        title="Post a Job"
        footerText="Back to dashboard?"
        footerLink="/dashboard"
        footerLinkText="Dashboard"
      >
        <PostJobForm email={email} />
      </AuthCard>
    </div>
  );
};

export default PostJobPage;
