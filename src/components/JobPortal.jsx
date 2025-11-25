import { Link } from "react-router-dom";

// Job portal CTA replicates "My Job with NIBM" from the original site.
const JobPortal = () => {
  return (
    <section className="max-w-6xl mx-auto px-4">
      <div className="bg-white rounded-3xl shadow-floating overflow-hidden grid md:grid-cols-2">
        <img
          src="https://d1lmq142maiv1z.cloudfront.net/medium_310_A0587_d90970ee93.jpg"
          alt="Job Portal"
          className="h-72 md:h-full w-full object-cover"
        />
        <div className="p-8 space-y-4">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC_PuEt5JVTl1hAcHd4XJruoZ2DUuMCbL4bQ&s"
            alt="NIBM Logo"
            className="h-10"
          />
          <h2 className="text-3xl font-bold text-gray-900">MY JOB with GIST</h2>
          <p className="text-gray-600">
            Centralized job portal where students and alumni access internships, part-time roles, and full-time
            opportunities aligned to their fields of study.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-white font-semibold"
          >
            Visit Job Portal
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JobPortal;