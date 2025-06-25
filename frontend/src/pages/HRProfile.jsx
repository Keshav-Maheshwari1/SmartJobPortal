import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ProfileSection from "../components/ProfileSection";
import JobSection from "../components/JobSection";
import AuthForm from "../components/AuthForm";
import ApplicantList from "../components/ApplicantList";
import InterviewPage from "./InterviewPage";

const HRProfilePage = () => {
  const [activeSection, setActiveSection] = useState("Profile");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();
  const hrEmail = localStorage.getItem("userEmail") || "";

  const sections = [
    {
      name: "Profile",
      icon: "M12 12a4 4 0 100-8 4 4 0 000 8zM12 14c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z",
    },
    { name: "Jobs", icon: "M4 6h16v2H4zm0 4h16v2H4zm0 4h16v2H4z" },
    {
      name: "Applicants",
      icon: "M9 13.75c-2.34 0-7 1.17-7 3.5V19h14v-1.75c0-2.33-4.66-3.5-7-3.5zM4.34 17c.84-.58 2.87-1.25 4.66-1.25s3.82.67 4.66 1.25H4.34zM9 12a4 4 0 100-8 4 4 0 000 8z",
    },
    {
      name: "Create Room",
      icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3 9h-2v-2h-2v2H9v2h2v2h2v-2h2v-2z",
    },
    {
      name: "Join Room",
      icon: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
    },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "Profile":
        return <ProfileSection userEmail={hrEmail} Role="HR" />;
      case "Jobs":
        return (
          <JobSection
            hrEmail={hrEmail}
            setSelectedJobId={setSelectedJobId}
            onJobClick={(jobId) => navigate(`/jobs/edit/${jobId}`)}
          />
        );
      case "Applicants":
        return <ApplicantList />;
      case "Create Room":
        return (
          <main className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-xl mx-auto">
            <AuthForm
              fields={[
                {
                  name: "roomId",
                  label: "Room ID",
                  type: "text",
                  value: roomId,
                  isPassword: false,
                },
                {
                  name: "date",
                  label: "Interview Date",
                  type: "datetime-local",
                  value: date,
                  isPassword: false,
                },
              ]}
              onSubmit={(e) => {
                e.preventDefault();
                if (!roomId.trim() || !date) {
                  alert("Please fill all fields.");
                  return;
                }
                const trimmedRoomId = roomId.trim();
                const isoDate = new Date(date).toISOString();
                localStorage.setItem("roomId", trimmedRoomId);
                localStorage.setItem("time", isoDate);

                alert("Interview Room details saved.");
              }}
              buttonLabel="Save Interview Info"
              isLoading={false}
              errors={{}}
              handleChange={(e) => {
                const { name, value } = e.target;
                if (name === "roomId") setRoomId(value);
                if (name === "date") setDate(value);
              }}
            />
          </main>
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col md:flex-row  ">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sections={sections}
      />
      <main className="flex-1 p-6 md:p-10 md:ml-24 overflow-auto ">
        <h1 className="text-3xl text-center text-white font-extrabold mb-10 tracking-wide">
          HR Dashboard
        </h1>
        <div className="animate-fade-in">{renderSection()}</div>
      </main>
      {selectedJobId && ""}
    </div>
  );
};

export default HRProfilePage;
