import { useContent } from "../context/ContentContext";
import { FaUniversity, FaUsers, FaChalkboardTeacher } from 'react-icons/fa';

// About section mirrors nibm.lk copy including vision, mission, OBL.
const About = () => {
  const {
    content: { siteMeta, stats },
  } = useContent();

  return (
    <section id="about" className="max-w-6xl mx-auto px-4 space-y-12 scroll-mt-20">
      <div className="text-center space-y-4">
        <p className="text-xs uppercase tracking-[0.5em] text-primary font-semibold">GIST Since 2001</p>
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
            “To be a leading private university in South Asia, setting benchmarks in transformative education that empowers individuals and communities. Through innovative programs, technology-driven learning, and inspiring teaching, we aim to make education engaging, accessible, and meaningful - enabling learners of all backgrounds to achieve excellence and shape a better future.”
          </p>
        </article>
        <article className="p-8 rounded-3xl bg-white shadow-floating">
          <h3 className="text-2xl font-semibold text-gray-900">Our Mission</h3>
          <p className="text-gray-600 italic mt-4">
            “To develop ethical, socially responsible, and market-ready graduates through innovation, research, skill development, and academic excellence - empowering them to contribute meaningfully at national and global levels.”
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
        <StatCard label="Campuses" value={stats.campuses} Icon={FaUniversity} />
        <StatCard label="Students" value={`${stats.students.toLocaleString()}+`} Icon={FaUsers} />
        <StatCard label="Lecturers" value={stats.lecturers} Icon={FaChalkboardTeacher} />
      </div>

      <div id="contact" className="bg-white rounded-3xl shadow-floating p-8 space-y-3 scroll-mt-20">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact GIST Campus</h3>
        <p className="text-gray-600 flex items-start gap-4 pb-3 border-b border-gray-100">
          <span className="font-semibold w-24 shrink-0">Address:</span>
          <span>{siteMeta?.contact?.address}</span>
        </p>
        <div className="text-gray-600 flex items-start gap-4 pb-3 border-b border-gray-100 uppercase">
          <span className="font-semibold w-24 shrink-0">Hotline:</span>
          <div className="flex flex-col gap-2">
            {siteMeta?.contact?.hotline?.split('\n').filter(Boolean).map((line, index) => (
              <a
                key={index}
                href={`tel:${line.replace(/\s+/g, '')}`}
                className="hover:text-primary transition-colors font-medium"
              >
                {line}
              </a>
            ))}
          </div>
        </div>
        <p className="text-gray-600 flex items-start gap-4 uppercase border-b border-gray-100 pb-3">
          <span className="font-semibold w-24 shrink-0">Email:</span>
          <a
            href={`mailto:${siteMeta?.contact?.email}`}
            className="hover:text-primary transition-colors font-medium lowercase"
          >
            {siteMeta?.contact?.email}
          </a>
        </p>
      </div>
    </section>
  );
};

const StatCard = ({ label, value, Icon }) => (
  <div className="p-6 rounded-2xl bg-primary text-white flex flex-col items-center justify-center space-y-2">
    <div className="flex items-center gap-4">
      {Icon && <Icon className="w-10 h-10 text-white/70 shrink-0" />}
      <p className="text-3xl md:text-4xl font-bold leading-none">{value}</p>
    </div>
    <p className="text-sm uppercase tracking-widest text-white/70 mt-1 text-center font-medium">{label}</p>
  </div>
);

export default About;

