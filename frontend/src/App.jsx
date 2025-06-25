import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import PostJobPage from "./pages/PostJobPage";
import DashboardPage from "./pages/Dashboard";
import JobDetailsPage from "./pages/JobDetails";
import ApplyJobFormPage from "./pages/ApplyJob";
import HRProfilePage from "./pages/HRProfile";
import UserProfilePage from "./pages/UserProfile";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./pages/Landing";
import InterviewPage from "./pages/InterviewPage";
import { ScrollToTop } from "./utils/ScrollToTop";
import JobEditPage from "./pages/JobEditPage";
import ProtectedRoute from "./components/ProtectedRouteProps";
import ContactPage from "./components/Contact";
import OfferLetterPage from "./pages/OfferLetterPage";

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-900">
        <Header />
        <main className="flex-1">
          <ScrollToTop />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Protected routes */}
            <Route
              path="/jobs/:jobId/apply"
              element={
                <ProtectedRoute>
                  <ApplyJobFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/post-job"
              element={
                <ProtectedRoute>
                  <PostJobPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs/:jobId"
              element={
                <ProtectedRoute>
                  <JobDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/hr"
              element={
                <ProtectedRoute>
                  <HRProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/offer/:applicantEmail/:jobId"
              element={
                <ProtectedRoute>
                  <OfferLetterPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile/applicant"
              element={
                <ProtectedRoute>
                  <UserProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs/edit/:jobId"
              element={
                <ProtectedRoute>
                  <JobEditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interviews/:roomId"
              element={
                <ProtectedRoute>
                  <InterviewPage />
                </ProtectedRoute>
              }
            />

            {/* Optional static routes - protect if needed */}
            <Route
              path="/contact"
              element={
                <ProtectedRoute>
                  <ContactPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/privacy"
              element={
                <ProtectedRoute>
                  <div className="container mx-auto p-4 text-gray-100">
                    Privacy Policy (Placeholder)
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/terms"
              element={
                <ProtectedRoute>
                  <div className="container mx-auto p-4 text-gray-100">
                    Terms of Service (Placeholder)
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/blog"
              element={
                <ProtectedRoute>
                  <div className="container mx-auto p-4 text-gray-100">
                    Blog (Placeholder)
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
