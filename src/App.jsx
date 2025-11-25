import { BrowserRouter, Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import FacultyDetail from "./pages/FacultyDetail";
import CourseDetail from "./pages/CourseDetail";
import Enroll from "./pages/Enroll";
import MyResults from "./pages/MyResults";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageContent from "./pages/admin/ManageContent";
import ManageFaculties from "./pages/admin/ManageFaculties";
import ManageProgrammes from "./pages/admin/ManageProgrammes";
import ManageCourses from "./pages/admin/ManageCourses";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageLecturers from "./pages/admin/ManageLecturers";
import ManageTranscripts from "./pages/admin/ManageTranscripts";
import StudentProfile from "./pages/student/StudentProfile";
import LecturerLayout from "./layouts/LecturerLayout";
import LecturerDashboard from "./pages/lecturer/LecturerDashboard";
import LecturerProfile from "./pages/lecturer/LecturerProfile";
import FacultyPage from "./pages/public/FacultyPage";
import CourseDetails from "./pages/public/CourseDetails";
import EnrollPage from "./pages/public/EnrollPage";
import NewsEventsPage from "./pages/public/NewsEventsPage";
import NewsEventDetail from "./pages/public/NewsEventDetail";
import { ContentProvider } from "./context/ContentContext";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import StudentLayout from "./layouts/StudentLayout";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ContentProvider>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="faculties/:facultyId" element={<FacultyPage />} />
              <Route path="courses/:courseSlug" element={<CourseDetails />} />
              <Route path="enroll" element={<EnrollPage />} />
              <Route path="news-events" element={<NewsEventsPage />} />
              <Route path="news-events/:id" element={<NewsEventDetail />} />
              <Route path="/results" element={<MyResults />} />
              <Route path="/login" element={<Login />} />
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
        </ContentProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;