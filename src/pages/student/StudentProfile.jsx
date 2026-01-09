import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useContent } from "../../context/ContentContext";
import { db } from "../../config/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate, useSearchParams } from "react-router-dom";

const StudentProfile = () => {
    const { currentUser, logout } = useAuth();
    const { content } = useContent();
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "personal");

    // Classroom State
    const [expandedCourseId, setExpandedCourseId] = useState(null);
    const [courseMaterials, setCourseMaterials] = useState({}); // { courseId: [files] }
    const [loadingMaterials, setLoadingMaterials] = useState(false);

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

    const toggleCourseExpansion = async (courseId) => {
        if (expandedCourseId === courseId) {
            setExpandedCourseId(null);
            return;
        }

        setExpandedCourseId(courseId);

        // Fetch materials if not already loaded for this course
        if (!courseMaterials[courseId]) {
            setLoadingMaterials(true);
            try {
                const q = query(collection(db, "course_contents"), where("courseId", "==", courseId));
                const querySnapshot = await getDocs(q);
                const materials = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Sort by date desc
                materials.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());

                setCourseMaterials(prev => ({
                    ...prev,
                    [courseId]: materials
                }));
            } catch (error) {
                console.error("Error fetching course materials:", error);
            } finally {
                setLoadingMaterials(false);
            }
        }
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
                        <div className="flex border-b border-gray-200 overflow-x-auto">
                            <button
                                onClick={() => setActiveTab("personal")}
                                className={`pb-4 px-4 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === "personal" ? "text-primary" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Personal <span className="hidden sm:inline">Information</span>
                                {activeTab === "personal" && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab("academic")}
                                className={`pb-4 px-4 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === "academic" ? "text-primary" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Academic <span className="hidden sm:inline">Information</span>
                                {activeTab === "academic" && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab("classroom")}
                                className={`pb-4 px-4 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === "classroom" ? "text-primary" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                My Learning
                                {activeTab === "classroom" && (
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

                            {/* Enrolled Courses Display (Simple List) */}
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

                    {/* Classroom / My Learning Tab */}
                    {activeTab === "classroom" && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Your Classrooms</h3>
                                <p className="text-sm text-gray-500">Select a course to view uploaded materials and content.</p>

                                {studentData.enrolledCourses && studentData.enrolledCourses.length > 0 ? (
                                    <div className="space-y-4">
                                        {studentData.enrolledCourses.map((course, idx) => {
                                            const isExpanded = expandedCourseId === course.courseId;
                                            const materials = courseMaterials[course.courseId] || [];

                                            return (
                                                <div key={idx} className={`border rounded-xl transition-all ${isExpanded ? 'border-primary shadow-sm bg-white' : 'border-gray-200 bg-gray-50'}`}>
                                                    <button
                                                        onClick={() => toggleCourseExpansion(course.courseId)}
                                                        className="w-full text-left p-4 sm:p-5 flex justify-between items-center"
                                                    >
                                                        <div>
                                                            <h4 className={`font-bold text-lg ${isExpanded ? 'text-primary' : 'text-gray-900'}`}>
                                                                {course.courseTitle}
                                                            </h4>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {content.faculties && content.faculties.find(f => f.id === course.facultyId)?.title}
                                                            </p>
                                                        </div>
                                                        <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </button>

                                                    {isExpanded && (
                                                        <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                                                            {loadingMaterials ? (
                                                                <div className="py-4 text-center text-sm text-gray-500">Loading materials...</div>
                                                            ) : (
                                                                <div>
                                                                    <div className="flex justify-between items-center mb-3">
                                                                        <h5 className="text-sm font-semibold text-gray-700">Course Materials</h5>
                                                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{materials.length} Files</span>
                                                                    </div>

                                                                    {materials.length > 0 ? (
                                                                        <div className="space-y-2">
                                                                            {materials.map(file => (
                                                                                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-white rounded-lg border border-gray-200 group transition-colors">
                                                                                    <div className="flex items-center space-x-3 overflow-hidden">
                                                                                        <div className="bg-white p-2 rounded border border-gray-200 text-primary">
                                                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                                            </svg>
                                                                                        </div>
                                                                                        <div className="min-w-0">
                                                                                            <p className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">{file.title}</p>
                                                                                            <p className="text-xs text-gray-500">
                                                                                                {file.lecturerName && <span className="mr-1">By {file.lecturerName} •</span>}
                                                                                                {new Date(file.createdAt?.seconds * 1000).toLocaleDateString()}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <a
                                                                                        href={file.fileUrl}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors flex items-center"
                                                                                    >
                                                                                        <span>Download</span>
                                                                                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                                        </svg>
                                                                                    </a>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                                                            <p className="text-sm text-gray-500">No materials uploaded specifically for this course yet.</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No Courses Found</h3>
                                        <p className="mt-1 text-sm text-gray-500">You are not enrolled in any courses yet.</p>
                                    </div>
                                )}
                            </div>
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
