import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Profile from "./pages/Profile";

import Companies from "./pages/admin/Companies";
import CompanyCreate from "./pages/admin/CompanyCreate";
import CompanySetup from "./pages/admin/CompanySetup";
import AdminJobs from "./pages/admin/AdminJobs";
import PostJob from "./pages/admin/PostJob";
import Applicants from "./pages/admin/Applicants";

// All the pages (routes) of the app are listed here.
export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* pages for any logged in user (backend needs login for jobs) */}
        <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
        <Route path="/jobs/:id" element={<ProtectedRoute><JobDetails /></ProtectedRoute>} />

        {/* student only */}
        <Route path="/profile" element={<ProtectedRoute role="student"><Profile /></ProtectedRoute>} />

        {/* recruiter only */}
        <Route path="/admin/companies" element={<ProtectedRoute role="recruiter"><Companies /></ProtectedRoute>} />
        <Route path="/admin/companies/create" element={<ProtectedRoute role="recruiter"><CompanyCreate /></ProtectedRoute>} />
        <Route path="/admin/companies/:id" element={<ProtectedRoute role="recruiter"><CompanySetup /></ProtectedRoute>} />
        <Route path="/admin/jobs" element={<ProtectedRoute role="recruiter"><AdminJobs /></ProtectedRoute>} />
        <Route path="/admin/jobs/create" element={<ProtectedRoute role="recruiter"><PostJob /></ProtectedRoute>} />
        <Route path="/admin/jobs/:id/applicants" element={<ProtectedRoute role="recruiter"><Applicants /></ProtectedRoute>} />
      </Routes>
    </>
  );
}
