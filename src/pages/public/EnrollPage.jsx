import { useLocation } from "react-router-dom";
import Enroll from "../Enroll"; // Importing from src/pages/Enroll.jsx
import { FaGraduationCap } from 'react-icons/fa';

const EnrollPage = () => {
    const location = useLocation();
    const initialCourse = location.state?.courseName || "";

    return (
        <div className="pt-20 pb-20 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Student Enrollment</h1>
                    <p className="text-gray-600 mt-2">Start your journey with us today.</p>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-1 overflow-hidden">
                    <Enroll initialCourse={initialCourse} />
                </div>
            </div>
        </div>
    );
};

export default EnrollPage;
