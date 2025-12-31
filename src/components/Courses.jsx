import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext";

// Programmes section: static tiles (per brief) + live course search and
// CTA to the enrollment form.
const Courses = () => {
  const { content, searchCourses } = useContent();
  const [query, setQuery] = useState("");
  const filteredCourses = useMemo(() => searchCourses(query), [query, searchCourses]);

  return (
    <section id="programmes" className="max-w-6xl mx-auto px-4 space-y-12">
      <div className="text-center">
        <p className="text-sm uppercase text-primary font-semibold tracking-[0.3em]">Programmes</p>
        <h2 className="text-4xl font-bold text-gray-900 mt-4">What is your next education pathway?</h2>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Masters, Degree, HND, Diploma, Advanced Certificate, Certificate, Foundation, Workshops.
        </p>
        <Link
          to="/enroll"
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-full font-semibold mt-6"
        >
          Enroll Now
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {content.programmes.map((programme) => (
          <div key={programme.id} className="bg-white rounded-2xl p-6 shadow-floating">
            <div className="text-3xl">{programme.icon}</div>
            <h3 className="text-xl font-semibold mt-4 text-gray-900">{programme.label}</h3>
            <p className="text-gray-600 text-sm mt-2">{programme.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-floating p-8 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Search the full course library</h3>
            <p className="text-gray-600 text-sm">Powered by the School & Faculty data inside Firebase.</p>
          </div>
          <input
            type="search"
            placeholder="Search by course, faculty or keyword"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="form-input sm:max-w-sm"
          />
        </div>

        <div className="grid gap-6">
          {filteredCourses.map((course) => (
            <article
              key={course.id}
              className="border border-gray-100 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center gap-6"
            >
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-primary font-semibold">{course.level}</p>
                <h4 className="text-2xl font-semibold text-gray-900 mt-1">{course.title}</h4>
                <p className="text-gray-600 mt-2">{course.description}</p>
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                  <span>Duration: {course.duration}</span>
                  <span>Mode: {course.mode}</span>
                  <span>Intake: {course.start}</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 shrink-0 w-full lg:w-48">
                <Link
                  to={`/courses/${course.slug}`}
                  className="w-full text-center px-4 py-2 rounded-full border border-gray-200 font-semibold"
                >
                  View details
                </Link>
                <Link
                  to="/enroll"
                  className="w-full text-center px-4 py-2 rounded-full bg-primary text-white font-semibold"
                >
                  Enroll Now
                </Link>
              </div>
            </article>
          ))}
          {filteredCourses.length === 0 && (
            <p className="text-center text-gray-500">No courses match that keyword yet.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Courses;






