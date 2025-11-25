import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";
import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const LecturerProfile = () => {
    const { currentUser, logout } = useAuth();
    const [lecturerData, setLecturerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("personal");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLecturerData = async () => {
            if (currentUser?.uid) {
                try {
                    const docRef = doc(db, "lecturers", currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setLecturerData(docSnap.data());
                    } else {
                        console.log("No such lecturer profile!");
                    }
                } catch (error) {
                    console.error("Error fetching lecturer data:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchLecturerData();
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

    if (!lecturerData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
                <p className="text-gray-600 mb-6">We couldn't find your lecturer record. Please contact administration.</p>
                <button onClick={() => navigate("/")} className="text-primary hover:underline">
                    Return Home
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6 border border-gray-100">
                <div className="h-32 bg-gradient-to-r from-primary to-blue-800"></div>
                <div className="px-6 pb-6">
                    <div className="relative flex items-end -mt-12 mb-4">
                        <div className="h-24 w-24 rounded-full ring-4 ring-white bg-white overflow-hidden shadow-md">
                            {lecturerData.photoUrl ? (
                                <img src={lecturerData.photoUrl} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-400">
                                    {lecturerData.fullName?.charAt(0) || "L"}
                                </div>
                            )}
                        </div>
                        <div className="ml-4 mb-1">
                            <h1 className="text-2xl font-bold text-gray-900">{lecturerData.fullName}</h1>
                            <p className="text-sm text-gray-500">{lecturerData.designation} • {lecturerData.faculty}</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab("personal")}
                            className={`pb-4 px-4 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === "personal" ? "text-primary" : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Personal & Contact
                            {activeTab === "personal" && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("academic")}
                            className={`pb-4 px-4 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === "academic" ? "text-primary" : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Academic & Professional
                            {activeTab === "academic" && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("system")}
                            className={`pb-4 px-4 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === "system" ? "text-primary" : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            System & Access
                            {activeTab === "system" && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-gray-100">
                {activeTab === "personal" && (
                    <div className="space-y-8 animate-fade-in">
                        <Section title="Basic Details">
                            <Field label="Full Name" value={lecturerData.fullName} />
                            <Field label="Lecturer ID" value={lecturerData.lecturerId} />
                            <Field label="Date of Birth" value={lecturerData.dob} />
                            <Field label="Gender" value={lecturerData.gender} />
                        </Section>

                        <Section title="Contact Information">
                            <Field label="Official Email" value={lecturerData.email} />
                            <Field label="Personal Email" value={lecturerData.personalEmail} />
                            <Field label="Mobile" value={lecturerData.mobile} />
                            <Field label="Office Phone" value={lecturerData.officePhone} />
                            <Field label="Address" value={lecturerData.address} />
                            <Field label="City" value={lecturerData.city} />
                        </Section>

                        <Section title="Emergency Contact">
                            <Field label="Contact Details" value={lecturerData.emergencyContact} />
                        </Section>
                    </div>
                )}

                {activeTab === "academic" && (
                    <div className="space-y-8 animate-fade-in">
                        <Section title="Professional Details">
                            <Field label="Designation" value={lecturerData.designation} />
                            <Field label="Faculty / Dept" value={lecturerData.faculty} />
                            <Field label="Campus" value={lecturerData.campus} />
                            <Field label="Employment Type" value={lecturerData.employmentType} />
                            <Field label="Date of Joining" value={lecturerData.dateOfJoining} />
                            <Field label="Reporting To" value={lecturerData.reportingTo} />
                        </Section>

                        <Section title="Qualifications & Experience">
                            <div className="col-span-1 sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500">Qualifications</dt>
                                <dd className="mt-1 text-sm text-gray-900 font-medium">{lecturerData.qualifications || "-"}</dd>
                            </div>
                            <Field label="Experience (Years)" value={lecturerData.experience} />
                        </Section>

                        <Section title="Research & Teaching">
                            <div className="col-span-1 sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500">Research Interests</dt>
                                <dd className="mt-1 text-sm text-gray-900 font-medium">{lecturerData.researchInterests || "-"}</dd>
                            </div>
                            <div className="col-span-1 sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500">Courses Assigned</dt>
                                <dd className="mt-1 text-sm text-gray-900 font-medium">
                                    {lecturerData.coursesAssigned ? (
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {lecturerData.coursesAssigned.split(",").map((course, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs border border-blue-100">
                                                    {course.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    ) : "-"}
                                </dd>
                            </div>
                        </Section>
                    </div>
                )}

                {activeTab === "system" && (
                    <div className="space-y-8 animate-fade-in">
                        <Section title="Account Status">
                            <div className="col-span-1 sm:col-span-2">
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${lecturerData.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                        }`}
                                >
                                    {lecturerData.isActive ? "Active Account" : "Inactive / Suspended"}
                                </span>
                            </div>
                            <Field label="Role" value={lecturerData.role} />
                            <Field label="Permissions" value={lecturerData.permissions} />
                        </Section>

                        <Section title="Office & Schedule">
                            <Field label="Office Location" value={lecturerData.officeLocation} />
                            <div className="col-span-1 sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500">Timetable / Availability</dt>
                                <dd className="mt-1 text-sm text-gray-900 font-medium whitespace-pre-wrap">{lecturerData.timetable || "-"}</dd>
                            </div>
                        </Section>
                    </div>
                )}
            </div>
        </div>
    );
};

const Section = ({ title, children }) => (
    <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{children}</div>
    </div>
);

const Field = ({ label, value }) => (
    <div>
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 font-medium">{value || "-"}</dd>
    </div>
);

export default LecturerProfile;
