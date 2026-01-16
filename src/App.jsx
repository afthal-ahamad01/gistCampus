import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import LoadingSpinner from "./components/LoadingSpinner"; // We'll need to create this or use a simple div

// Layouts - Keep statically imported if they are small or critical
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import StudentLayout from "./layouts/StudentLayout";
import LecturerLayout from "./layouts/LecturerLayout";

import { ContentProvider } from "./context/ContentContext";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

// Lazy Load Pages
const Home = lazy(() => import("./pages/Home"));
const FacultyDetail = lazy(() => import("./pages/FacultyDetail"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const Enroll = lazy(() => import("./pages/Enroll"));
const MyResults = lazy(() => import("./pages/MyResults"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));

// Admin - Lazy Load
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ManageContent = lazy(() => import("./pages/admin/ManageContent"));
const ManageFaculties = lazy(() => import("./pages/admin/ManageFaculties"));
const ManageProgrammes = lazy(() => import("./pages/admin/ManageProgrammes"));
const ManageCourses = lazy(() => import("./pages/admin/ManageCourses"));
const ManageStudents = lazy(() => import("./pages/admin/ManageStudents"));
const ManageLecturers = lazy(() => import("./pages/admin/ManageLecturers"));
const ManageTranscripts = lazy(() => import("./pages/admin/ManageTranscripts"));

// Student & Lecturer - Lazy Load
const StudentProfile = lazy(() => import("./pages/student/StudentProfile"));
const LecturerDashboard = lazy(() => import("./pages/lecturer/LecturerDashboard"));
const LecturerProfile = lazy(() => import("./pages/lecturer/LecturerProfile"));

// Public Pages - Lazy Load
const FacultyPage = lazy(() => import("./pages/public/FacultyPage"));
const CourseDetails = lazy(() => import("./pages/public/CourseDetails"));
const EnrollPage = lazy(() => import("./pages/public/EnrollPage"));
const NewsEventsPage = lazy(() => import("./pages/public/NewsEventsPage"));
const NewsEventDetail = lazy(() => import("./pages/public/NewsEventDetail"));
const ProgrammeDetail = lazy(() => import("./pages/public/ProgrammeDetail"));
const PrivacyPolicy = lazy(() => import("./pages/public/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("./pages/public/CookiePolicy"));

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ContentProvider>
          <ScrollToTop />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="programmes/:id" element={<ProgrammeDetail />} />
                <Route path="faculties/:facultyId" element={<FacultyPage />} />
                <Route path="courses/:courseSlug" element={<CourseDetails />} />
                <Route path="enroll" element={<EnrollPage />} />
                <Route path="news-events" element={<NewsEventsPage />} />
                <Route path="news-events/:id" element={<NewsEventDetail />} />
                <Route path="/results" element={<MyResults />} />
                <Route path="/login" element={<Login />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
              </Route>

              {/* Protected Routes */}
              <Route
                path="/student/*"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="profile" element={<StudentProfile />} />
              </Route>

              <Route
                path="/lecturer/*"
                element={
                  <ProtectedRoute allowedRoles={["lecturer"]}>
                    <LecturerLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<LecturerDashboard />} />
                <Route path="profile" element={<LecturerProfile />} />
              </Route>

              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="students" element={<ManageStudents />} />
                <Route path="lecturers" element={<ManageLecturers />} />
                <Route path="faculties" element={<ManageFaculties />} />
                <Route path="programmes" element={<ManageProgrammes />} />
                <Route path="courses" element={<ManageCourses />} />
                <Route path="content" element={<ManageContent />} />
                <Route path="transcripts" element={<ManageTranscripts />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ContentProvider>

      </AuthProvider >
    </BrowserRouter >
  );
};

export default App;