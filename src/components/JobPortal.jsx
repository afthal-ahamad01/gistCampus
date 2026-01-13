import { Link } from "react-router-dom";
import Logo from "../data/Assets/Logo.png";
import Hero1 from "../data/Assets/hero2.webp";

// Job portal CTA replicates "My Job with NIBM" from the original site.
const JobPortal = () => {
  return (
    <section className="max-w-6xl mx-auto px-4">
      <div className="bg-white rounded-3xl shadow-floating overflow-hidden grid md:grid-cols-2">
        <img
          src={Hero1}
          alt="Job Portal"
          className="h-72 md:h-full w-full object-cover"
        />
        <div className="p-8 space-y-4">
          <img
            src={Logo}
            alt="GIST Logo"
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