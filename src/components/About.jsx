import { useContent } from "../context/ContentContext";

// About section mirrors nibm.lk copy including vision, mission, OBL.
const About = () => {
  const {
    content: { siteMeta, stats },
  } = useContent();

  return (
    <section id="about" className="max-w-6xl mx-auto px-4 space-y-12">
      <div className="text-center space-y-4">
        <p className="text-xs uppercase tracking-[0.5em] text-primary font-semibold">GIST Since 1968</p>
        <h2 className="text-4xl font-bold text-gray-900">Empowering thousands to carve better futures</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          GIST Campus is the premier Business School in Sri Lanka. We keep abreast of
          global trends and constantly upgrade our products to suit today’s needs.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <article className="p-8 rounded-3xl bg-white shadow-floating">
          <h3 className="text-2xl font-semibold text-gray-900">Our Vision</h3>
          <p className="text-gray-600 italic mt-4">
            “To become an organization dedicated to produce thinkers capable of transforming their own lives and lives of others”
          </p>
        </article>
        <article className="p-8 rounded-3xl bg-white shadow-floating">
          <h3 className="text-2xl font-semibold text-gray-900">Our Mission</h3>
          <p className="text-gray-600 italic mt-4">
            “Creating a learning environment for fostering innovation through experiential learning to produce highly influential lifelong learners”
          </p>
        </article>
      </div>

      <article className="bg-white rounded-3xl shadow-floating p-8 space-y-4">
        <h3 className="text-2xl font-semibold text-gray-900">Outcome Based Learning</h3>
        <p className="text-gray-600">
          Outcome-based learning focuses on defining specific, measurable learning objectives and assessing students based on their achievement of these outcomes. Teaching strategies, assessments, and curriculum are aligned to ensure
          students know exactly what they should accomplish by the end of a course, driving critical thinking and real-world readiness.
        </p>
        <button className="text-primary font-semibold">See more →</button>
      </article>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Campuses" value={stats.campuses} />
        <StatCard label="Students" value={`${stats.students.toLocaleString()}+`} />
        <StatCard label="Lecturers" value={stats.lecturers} />
      </div>

      <div id="contact" className="bg-white rounded-3xl shadow-floating p-8 space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">Contact GIST Campus</h3>
        <p className="text-gray-600">{siteMeta.contact.address}</p>
        <p className="text-gray-600">Hotline: {siteMeta.contact.hotline}</p>
        <p className="text-gray-600">Email: {siteMeta.contact.email}</p>
      </div>
    </section>
  );
};

const StatCard = ({ label, value }) => (
  <div className="p-6 rounded-2xl bg-primary text-white text-center">
    <p className="text-3xl font-bold">{value}</p>
    <p className="text-sm uppercase tracking-widest text-white/70 mt-1">{label}</p>
  </div>
);

export default About;

