import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";
import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, useSearchParams } from "react-router-dom";

const StudentProfile = () => {
    const { currentUser, logout } = useAuth();
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "personal");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudentData = async () => {
            if (currentUser?.uid) {
                try {
                    const docRef = doc(db, "students", currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setStudentData(docSnap.data());
                    } else {
                        console.log("No such student profile!");
                    }
                } catch (error) {
                    console.error("Error fetching student data:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchStudentData();
    }, [currentUser]);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!studentData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
                <p className="text-gray-600 mb-6">We couldn't find your student record. Please contact administration.</p>
                <button onClick={() => navigate("/")} className="text-primary hover:underline">
                    Return Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
                    <div className="h-32 bg-gradient-to-r from-primary to-blue-600"></div>
                    <div className="px-6 pb-6">
                        <div className="relative flex items-end -mt-12 mb-4">
                            <div className="h-24 w-24 rounded-full ring-4 ring-white bg-white overflow-hidden shadow-md">
                                {studentData.photoUrl ? (
                                    <img src={studentData.photoUrl} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-400">
                                        {studentData.fullName?.charAt(0) || "S"}
                                    </div>
                                )}
                            </div>
                            <div className="ml-4 mb-1">
                                <h1 className="text-2xl font-bold text-gray-900">{studentData.fullName}</h1>
                                <p className="text-sm text-gray-500">{studentData.studentId} • {studentData.programme}</p>
                            </div>
                            <div className="ml-auto mb-1 hidden sm:block">
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab("personal")}
                                className={`pb-4 px-4 text-sm font-medium transition-colors relative ${activeTab === "personal" ? "text-primary" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Personal Information
                                {activeTab === "personal" && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab("academic")}
                                className={`pb-4 px-4 text-sm font-medium transition-colors relative ${activeTab === "academic" ? "text-primary" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Academic Information
                                {activeTab === "academic" && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                    {activeTab === "personal" && (
                        <div className="space-y-8 animate-fade-in">
                            <Section title="Basic Details">
                                <Field label="Full Name" value={studentData.fullName} />
                                <Field label="Date of Birth" value={studentData.dob} />
                                <Field label="Gender" value={studentData.gender} />
                                <Field label="NIC" value={studentData.nic} />
                            </Section>

                            <Section title="Contact Information">
                                <Field label="Email" value={studentData.email} />
                                <Field label="Mobile" value={studentData.mobile} />
                                <Field label="Address" value={studentData.address} />
                                <Field label="City" value={studentData.city} />
                            </Section>

                            <Section title="Guardian & Support">
                                <Field label="Guardian Info" value={studentData.guardianInfo} />
                                <Field label="Scholarship" value={studentData.scholarshipStatus} />
                            </Section>
                        </div>
                    )}

                    {activeTab === "academic" && (
                        <div className="space-y-8 animate-fade-in">
                            <Section title="Enrollment Details">
                                <Field label="Student ID" value={studentData.studentId} />
                                <Field label="Programme" value={studentData.programme} />
                                <Field label="Faculty" value={studentData.faculty} />
                                <Field label="Batch" value={studentData.batch} />
                                <Field label="Enrollment Date" value={studentData.enrollmentDate} />
                            </Section>

                            {/* Enrolled Courses Display */}
                            <Section title="Enrolled Courses">
                                {studentData.enrolledCourses && studentData.enrolledCourses.length > 0 ? (
                                    <div className="col-span-1 sm:col-span-2 space-y-3">
                                        {studentData.enrolledCourses.map((course, idx) => (
                                            <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{course.courseTitle}</h4>
                                                    <p className="text-sm text-gray-500">
                                                        Enrolled: {new Date(course.enrolledDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <span className="mt-2 sm:mt-0 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full w-fit">
                                                    {course.status || "Enrolled"}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="col-span-1 sm:col-span-2 text-gray-500 italic">
                                        No active course enrollments found.
                                    </div>
                                )}
                            </Section>

                            <Section title="Status">
                                <div className="col-span-1 sm:col-span-2">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${studentData.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {studentData.isActive ? "Active Student" : "Inactive / Suspended"}
                                    </span>
                                </div>
                                <Field label="Certificate Number" value={studentData.certificateNumber || "Not Issued"} />
                            </Section>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Section = ({ title, children }) => (
    <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{children}</div>
    </div>
);

const Field = ({ label, value }) => (
    <div>
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 font-medium">{value || "-"}</dd>
    </div>
);

export default StudentProfile;
