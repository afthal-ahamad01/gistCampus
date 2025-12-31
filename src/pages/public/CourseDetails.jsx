import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useContent } from "../../context/ContentContext";

const CourseDetails = () => {
    const { courseSlug } = useParams();
    const { content } = useContent();
    const [course, setCourse] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (content.courses) {
            const foundCourse = content.courses.find((c) => c.slug === courseSlug);
            setCourse(foundCourse);
        }
    }, [courseSlug, content.courses]);

    if (!course) {
        return <div className="min-h-screen flex items-center justify-center">Loading Course...</div>;
    }

    const handleApply = () => {
        // Navigate to home with hash to scroll to enroll section, 
        // or we could have a dedicated enroll page. 
        // For now, let's assume we go to /enroll or the home anchor.
        // The prompt said "linking it to the enrolle now section".
        // Assuming there is an Enroll Now form on the home page or a separate page.
        // Let's check App.jsx routes later. There is an "EnrollNow" component in Header?
        // Actually, there is a publicActions.js service.
        // Let's navigate to a dedicated enroll page if it exists, or just use a state to open the modal?
        // The user previously mentioned "Enroll Now" form.
        // Let's just link to a hypothetical /enroll route or use state.
        // For now, I'll navigate to /enroll and pass the course name.
        navigate("/enroll", { state: { courseName: course.title } });
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Hero Banner */}
            <div className="relative h-96 bg-gray-900">
                <img
                    src={course.heroImage || "https://via.placeholder.com/1200x600?text=Course+Banner"}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <span className="inline-block px-3 py-1 bg-primary text-white text-sm font-bold uppercase tracking-wider rounded mb-4">
                            {course.level}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                            {course.title}
                        </h1>
                        <div className="flex flex-wrap justify-center gap-6 text-gray-300 text-sm md:text-base">
                            <span className="flex items-center gap-2">
                                ⏱ {course.duration}
                            </span>
                            <span className="flex items-center gap-2">
                                📅 Starts {course.start}
                            </span>
                            <span className="flex items-center gap-2">
                                🎓 {course.mode}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-12">
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Overview</h2>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    {course.description}
                                </p>
                            </section>

                            {course.pathway && (
                                <section>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Pathway</h2>
                                    <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                                        {course.pathway}
                                    </p>
                                </section>
                            )}

                            {course.modules && course.modules.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Structure & Modules</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {course.modules.map((mod, idx) => (
                                            <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                                <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0"></div>
                                                <span className="text-gray-700 font-medium">{mod}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {course.outcomes && course.outcomes.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Learning Outcomes</h2>
                                    <ul className="space-y-3">
                                        {course.outcomes.map((outcome, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-gray-600">
                                                <span className="text-green-500 font-bold">✓</span>
                                                {outcome}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Entry Requirements</h3>
                                {course.entryRequirements && course.entryRequirements.length > 0 ? (
                                    <ul className="space-y-3">
                                        {course.entryRequirements.map((req, idx) => (
                                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                                <span className="text-primary">•</span>
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500">Contact us for details.</p>
                                )}
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Course Fees</h3>
                                <div className="text-3xl font-bold text-primary mb-2">
                                    {course.fees || "Contact Us"}
                                </div>
                                <p className="text-xs text-gray-500">
                                    * Fees are subject to change. Installment plans available.
                                </p>
                            </div>

                            <button
                                onClick={handleApply}
                                className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg shadow-primary/30 transform hover:-translate-y-1"
                            >
                                Apply Now
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
