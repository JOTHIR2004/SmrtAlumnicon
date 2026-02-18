import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import SignupChoice from "./components/SignupChoice";
import StudentSignup from "./components/StudentSignup";
import AlumniSignup from "./components/AlumniSignup";
import AdminLogin from "./components/AdminLogin";
import StudentHome from "./components/StudentHome";
import StudentProfile from "./components/StudentProfile";
import AdminDashboard from "./components/AdminDashboard";
import PendingResumes from "./components/PendingResumes";
import AlumniHome from "./components/AlumniHome";
import AlumniProfile from "./components/AlumniProfile";
import PostEvent from "./components/PostEvent";
import AlumniSugeesions from "./components/AlumniSuggestions";
import UserProfilesPage from "./components/UserProfilesPage";
import AdminEvents from "./components/AdminEvents";
import DigiAsst from "./components/DigiAsst";
import AddBanner from "./components/AddBanner";

function App() {
  return (
    <Router>
      {/* App Wrapper */}
      <div className="min-h-screen bg-gray-100 text-black">
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />

          {/* Signup */}
          <Route path="/signup" element={<SignupChoice />} />
          <Route path="/signup/student" element={<StudentSignup />} />
          <Route path="/signup/alumni" element={<AlumniSignup />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/pending-resumes" element={<PendingResumes />} />
          <Route path="/admin/userprofiles" element={<UserProfilesPage />} />
          <Route path="/admin/alumnievents" element={<AdminEvents />} />
          <Route path="/add-banner" element={<AddBanner />} />


          {/* Student */}
          <Route path="/student/home" element={<StudentHome />} />
          <Route path="/student-profile" element={<StudentProfile />} />

          {/* Alumni */}
          <Route path="/alumni/home" element={<AlumniHome />} />
          <Route path="/alumni-profile" element={<AlumniProfile />} />
          <Route path="/post-event" element={<PostEvent />} />
          <Route
            path="/alumni-suggestions"
            element={<AlumniSugeesions />}
          />
          <Route path="/digital-assistance" element={<DigiAsst/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
