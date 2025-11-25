import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useContent } from "../../context/ContentContext";

const FacultyPage = () => {
    const { facultyId } = useParams();
    const { content } = useContent();
    const [faculty, setFaculty] = useState(null);
    const [activeProgramType, setActiveProgramType] = useState(null);

    useEffect(() => {
        if (content.faculties) {
            const foundFaculty = content.faculties.find((f) => f.id === facultyId);
            setFaculty(foundFaculty);
        }
    }, [facultyId, content.faculties]);

    if (!faculty) {
        return <div className="min-h-screen flex items-center justify-center">Loading Faculty...</div>;
    }

    // Filter courses for this faculty
    const facultyCourses = content.courses.filter((c) => c.facultyId === facultyId);

    // Get unique program types available for this faculty
    const availableProgramTypes = content.programmes.filter((prog) =>
        facultyCourses.some((c) => c.programTypeId === prog.id)
    );

    // Filter courses based on active program type
    const displayedCourses = activeProgramType
        ? facultyCourses.filter((c) => c.programTypeId === activeProgramType)
        : facultyCourses; // Show all if none selected, or maybe show none? User said "when i click... it should show courses"

    // User request: "below that box of contents with icon each containing each type of program... and when i click each of these programs the respective courses should be shown below"
    // Implication: Initially maybe show all or none? Let's show all by default or just the first one?
    // Let's default to showing nothing or all. "Please click on any programme below to see the courses" suggests showing nothing initially or just the categories.
    // I will default to null (showing nothing) or maybe the first available one if I want to be helpful.
    // The prompt says: "below that a heading saying 'Courses' and below it a small sub heading 'Please click on any programme below to see the courses'"

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <div className="relative bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">{faculty.title}</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    {faculty.excerpt}
                                </p>
                            </div>
                        </main>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <img
                        className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
                        src={faculty.heroImage}
                        alt={faculty.title}
                    />
                </div>
            </div>

            {/* Programs Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900">Courses</h2>
                    <p className="mt-4 text-lg text-gray-500">Please click on any programme below to see the courses</p>
                </div>

                {/* Program Types Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                    {content.programmes.map((prog) => {
                        // Check if this faculty actually has courses of this type
                        const hasCourses = facultyCourses.some(c => c.programTypeId === prog.id);
                        if (!hasCourses) return null;

                        const isActive = activeProgramType === prog.id;

                        return (
                            <button
                                key={prog.id}
                                onClick={() => setActiveProgramType(prog.id)}
                                className={`flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-200 border-2 ${isActive
                                    ? "border-primary bg-primary/5 shadow-lg scale-105"
                                    : "border-gray-200 bg-white hover:border-primary/50 hover:shadow-md"
                                    }`}
                            >
                                <span className="text-4xl mb-3">{prog.icon}</span>
                                <h3 className={`text-lg font-bold ${isActive ? "text-primary" : "text-gray-900"}`}>
                                    {prog.label}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1 text-center">{prog.description}</p>
                            </button>
                        );
                    })}
                </div>

                {/* Course List */}
                {activeProgramType && (
                    <div className="animate-fade-in">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">
                            {content.programmes.find(p => p.id === activeProgramType)?.label} Programmes
                        </h3>

                        {displayedCourses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {displayedCourses.map((course) => (
                                    <Link
                                        key={course.id}
                                        to={`/courses/${course.slug}`}
                                        className="flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                                    >
                                        <div className="h-48 overflow-hidden relative">
                                            <img
                                                src={course.heroImage || "https://via.placeholder.com/400x300?text=Course+Image"}
                                                alt={course.title}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                                <span className="text-white font-medium">View Course Details →</span>
                                            </div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide rounded">
                                                    {course.level}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {course.duration}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                                {course.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                                                {course.description}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-10">No courses found for this category yet.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FacultyPage;
