import { Link, useParams } from "react-router-dom";
import { useContent } from "../../context/ContentContext";

const ProgrammeDetail = () => {
    const { id } = useParams();
    const { content } = useContent();

    const programme = content.programmes?.find(p => p.id === id);
    // Find courses that match this programme ID
    // Note: In ManageCourses we saved it as 'programTypeId'
    const courses = content.courses?.filter(c => c.programTypeId === id);

    if (!programme) {
        return (
            <section className="max-w-4xl mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-semibold mb-4">Programme not found</h1>
                <Link to="/" className="px-6 py-3 bg-primary text-white rounded-md">
                    Back to Home
                </Link>
            </section>
        );
    }

    return (
        <section className="max-w-6xl mx-auto px-4 py-20">
            <div className="mb-12 text-center">
                <p className="text-sm uppercase tracking-wide text-primary font-semibold">Study Programme</p>
                <h1 className="text-4xl font-bold text-gray-900 mt-2">{programme.name}</h1>
                {programme.description && (
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">{programme.description}</p>
                )}
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {courses && courses.length > 0 ? (
                    courses.map(course => (
                        <Link key={course.id} to={`/courses/${course.slug}`} className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden">
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={course.heroImage || "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
                                    alt={course.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
                                    {course.title}
                                </h3>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                    {course.description || "Explore this course to learn more about the curriculum and career pathways."}
                                </p>
                                <div className="flex items-center justify-between text-sm font-medium text-gray-900">
                                    <span>{course.duration || "Duration N/A"}</span>
                                    <span className="text-primary group-hover:translate-x-1 transition-transform">View Details →</span>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl">
                        <p className="text-gray-500 text-lg">No courses currently available for this programme.</p>
                        <p className="text-gray-400 text-sm mt-2">Please check back later or contact us for more information.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProgrammeDetail;
