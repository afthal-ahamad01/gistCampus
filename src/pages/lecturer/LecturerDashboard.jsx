import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";
import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";

const LecturerDashboard = () => {
    const { currentUser } = useAuth();
    const [lecturerData, setLecturerData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLecturerData = async () => {
            if (currentUser?.uid) {
                try {
                    const docRef = doc(db, "lecturers", currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setLecturerData(docSnap.data());
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

    if (loading) {
        return <div className="p-8 text-center">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {lecturerData?.fullName || "Lecturer"}! 👋
                </h1>
                <p className="text-gray-500 mt-1">Here's what's happening with your courses today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Assigned Courses</div>
                    <div className="mt-2 text-3xl font-bold text-primary">
                        {lecturerData?.coursesAssigned ? lecturerData.coursesAssigned.split(",").length : 0}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending Notices</div>
                    <div className="mt-2 text-3xl font-bold text-orange-500">0</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Students</div>
                    <div className="mt-2 text-3xl font-bold text-green-600">-</div>
                </div>
            </div>

            {/* Recent Activity / Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between group">
                            <span className="font-medium text-gray-700 group-hover:text-primary">Upload Course Material</span>
                            <span className="text-gray-400 group-hover:text-primary">→</span>
                        </button>
                        <button className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between group">
                            <span className="font-medium text-gray-700 group-hover:text-primary">Post New Notice</span>
                            <span className="text-gray-400 group-hover:text-primary">→</span>
                        </button>
                        <button className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between group">
                            <span className="font-medium text-gray-700 group-hover:text-primary">View Timetable</span>
                            <span className="text-gray-400 group-hover:text-primary">→</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Courses</h3>
                    {lecturerData?.coursesAssigned ? (
                        <ul className="divide-y divide-gray-100">
                            {lecturerData.coursesAssigned.split(",").map((course, index) => (
                                <li key={index} className="py-3 flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                                        {course.trim().charAt(0)}
                                    </div>
                                    <span className="text-gray-700 font-medium">{course.trim()}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">No courses assigned yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LecturerDashboard;
