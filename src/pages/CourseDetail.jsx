import { Link, useParams } from "react-router-dom";
import { useContent } from "../context/ContentContext";

// Course detail view reuses the same data that will later be fully CRUD
// managed by admins. Each card surfaces programme meta + outcomes.
const CourseDetail = () => {
  const { courseSlug } = useParams();
  const { getCourseBySlug, getFacultyById } = useContent();
  const course = getCourseBySlug(courseSlug);

  if (!course) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-semibold mb-4">Course not found</h1>
        <p className="mb-6 text-gray-600">Please select a published course from the Programmes section.</p>
        <Link to="/#programmes" className="px-6 py-3 bg-primary text-white rounded-md">
          Back to Programmes
        </Link>
      </section>
    );
  }

  const faculty = getFacultyById(course.facultyId);

  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
      <div className="grid lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2 bg-white rounded-3xl shadow p-8 space-y-6">
          <div>
            <p className="uppercase text-sm font-semibold text-primary tracking-wider">{course.level}</p>
            <h1 className="text-4xl font-bold text-gray-900 mt-2">{course.title}</h1>
            <p className="text-gray-600 mt-4 leading-relaxed">{course.description}</p>
          </div>

          <div className="border border-gray-100 rounded-2xl p-6 grid sm:grid-cols-2 gap-4 bg-gray-50">
            <div>
              <p className="text-sm text-gray-500">Faculty</p>
              <p className="font-semibold text-gray-900">{faculty?.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-semibold text-gray-900">{course.duration}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Mode</p>
              <p className="font-semibold text-gray-900">{course.mode}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Next Intake</p>
              <p className="font-semibold text-gray-900">{course.start}</p>
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Learning Outcomes</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {course.outcomes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Entry Requirements</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {course.entryRequirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <div className="flex flex-wrap gap-4 pt-4">
            <a href={course.brochureUrl} className="px-6 py-3 border border-gray-200 rounded-full">
              Download Brochure
            </a>
            <Link to="/enroll" className="px-6 py-3 bg-primary text-white rounded-full">
              Enroll Now
            </Link>
          </div>
        </article>

        <aside className="bg-white rounded-3xl shadow overflow-hidden">
          <img src={course.heroImage} alt={course.title} className="h-64 w-full object-cover" />
          <div className="p-6 space-y-6">
            <div>
              <p className="text-sm text-gray-500">Tuition</p>
              <p className="text-2xl font-semibold text-gray-900">{course.tuition}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Need assistance?</p>
              <p className="text-gray-800 font-medium">Call +94 117 321 000</p>
            </div>
            <Link
              to="/results"
              className="block text-center w-full bg-gray-900 text-white rounded-xl py-3 font-semibold"
            >
              Verify Results
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default CourseDetail;

