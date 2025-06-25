import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useGetAppliedJobsByApplicantEmail } from "../customHooks/useAppliedJob";
import ProfileSection from "../components/ProfileSection";
import AppliedJobList from "../components/AppliedJobList";
import InterviewPage from "./InterviewPage";

const UserProfilePage = () => {
  const [activeSection, setActiveSection] = useState("Profile");
  const userEmail = localStorage.getItem("userEmail") || "";
  const {
    data: appliedJobs,
    isLoading,
    error,
  } = useGetAppliedJobsByApplicantEmail(userEmail);

  const sections = [
    {
      name: "Profile",
      icon: "M12 12a4 4 0 100-8 4 4 0 000 8zM12 14c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z",
    },
    {
      name: "Applied Jobs",
      icon: "M4 6h16v2H4zm0 4h16v2H4zm0 4h16v2H4z",
    },
    {
      name: "Join Room",
      icon: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
    },
  ];
  const renderSection = () => {
    switch (activeSection) {
      case "Profile":
        return <ProfileSection userEmail={userEmail} Role={"Applicant"} />;
      case "Applied Jobs":
        return (
          <AppliedJobList
            isLoading={isLoading}
            appliedJobs={appliedJobs}
            error={error}
          />
        );
      case "Join Room":
        return (
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-xl mx-auto">
            <InterviewPage />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col md:flex-row">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sections={sections}
      />
      <main className="flex-1 p-6 md:p-10 md:ml-24">
        <h1 className="text-3xl text-center text-white font-extrabold mb-10 tracking-wide">
          Applicant Dashboard
        </h1>
        {renderSection()}
      </main>
    </div>
  );
};

export default UserProfilePage;
