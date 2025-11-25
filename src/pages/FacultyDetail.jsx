import { Link, useParams } from "react-router-dom";
import { useContent } from "../context/ContentContext";

// Displays a richer overview per faculty. Admin-managed markdown can
// extend this view in the future.
const FacultyDetail = () => {
  const { facultyId } = useParams();
  const { getFacultyById } = useContent();
  const faculty = getFacultyById(facultyId);

  if (!faculty) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-semibold mb-4">Faculty not found</h1>
        <p className="mb-6 text-gray-600">
          The requested faculty page has moved or is still being drafted. Please return to the home page.
        </p>
        <Link to="/" className="px-6 py-3 bg-primary text-white rounded-md">
          Back to Home
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-wide text-primary font-semibold">Faculty</p>
        <h1 className="text-4xl font-bold text-gray-900 mt-2">{faculty.title}</h1>
        <p className="text-lg text-gray-600 mt-4 max-w-3xl">{faculty.excerpt}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <article className="bg-white shadow rounded-2xl p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Academic Focus</h2>
            <p className="text-gray-600 leading-relaxed">
              {faculty.academicFocus ||
                "This faculty curates internationally benchmarked curricula, industry collaborations, and practical labs that mirror the official NIBM experience. Detailed copy will be synced from the admin CMS."}
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              {(faculty.highlightTracks || []).map((track) => (
                <li key={track}>{track}</li>
              ))}
            </ul>
          </article>

          <article className="bg-white shadow rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Student Experience</h3>
            <p className="text-gray-600">
              Outcome based learning, mentorships, hackathons, and industry immersions prepare students to excel globally.
            </p>
            <div className="flex flex-wrap gap-3">
              {(faculty.badges || ["Outcome Based Learning", "Industry Mentors", "Global Pathways"]).map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                >
                  {badge}
                </span>
              ))}
            </div>
          </article>
        </div>

        <aside className="bg-white shadow rounded-2xl p-6 space-y-6">
          <img
            src={faculty.heroImage}
            alt={faculty.title}
            className="w-full rounded-xl object-cover h-64"
          />
          <div>
            <h4 className="text-lg font-semibold mb-2 text-gray-900">Official NIBM Page</h4>
            <p className="text-gray-600 text-sm mb-4">
              Explore the official NIBM layout for this school to compare modules, recognition pathways, and facilities.
            </p>
            <a
              href={faculty.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-primary font-semibold"
            >
              Visit nibm.lk ↗
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default FacultyDetail;

