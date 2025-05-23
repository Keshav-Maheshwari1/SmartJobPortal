import React, { useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import { useGetAppliedJobsByApplicantEmail } from "../customHooks/useAppliedJob";
import RoomForm from "../components/RoomForm";
import ProfileSection from "../components/ProfileSection";

const UserProfilePage = () => {
  const [activeSection, setActiveSection] = useState("Profile");
  const userEmail = localStorage.getItem("userEmail") || "";

  const {
    data: appliedJobs = [],
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

  const sectionRef = useRef({
    Profile: () => <ProfileSection userEmail={userEmail} />,
    "Applied Jobs": () => (
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {isLoading && appliedJobs.length <= 0 && (
          <p className="text-gray-400 text-center col-span-full">
            Loading applied jobs...
          </p>
        )}
        {error && (
          <p className="text-red-500 text-center col-span-full">
            Error loading jobs
          </p>
        )}
        {appliedJobs.length > 0 ? (
          appliedJobs.map((job) => (
            <div
              key={job.id}
              className="bg-gray-800 p-5 rounded-xl shadow-xl border border-gray-700 hover:shadow-2xl transition-all"
            >
              <h3 className="text-xl text-white font-semibold mb-2">
                {job.title}
              </h3>
              <p className="text-gray-400 mb-1">{job.description}</p>
              <p className="text-gray-500 text-sm">
                Applied: {new Date(job.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-600 text-xs mt-2">
                Applicant Email: {job.applicantEmail}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center col-span-full">
            No jobs applied yet.
          </p>
        )}
      </div>
    ),
    "Join Room": () => (
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-xl mx-auto">
        <RoomForm />
      </div>
    ),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col md:flex-row">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sections={sections}
      />
      <main className="flex-1 p-6 md:p-10">
        <h1 className="text-3xl text-center text-white font-extrabold mb-10 tracking-wide">
          Applicant Dashboard
        </h1>
        {sectionRef.current[activeSection]()}
      </main>
    </div>
  );
};

export default UserProfilePage;
