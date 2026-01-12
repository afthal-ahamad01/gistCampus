import { useContent } from "../context/ContentContext";
import { FaHistory, FaGlobe, FaBriefcase, FaUniversity, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';

// Shared KPI strip reused in About page as well (the Admin edits sync
// via Firebase).
const Stats = () => {
  const {
    content: { stats },
  } = useContent();

  const statList = [
    { label: "Years of excellence", value: stats.years, rawValue: stats.years, icon: FaHistory },
    { label: "Foreign Partnerships", value: stats.foreignPartnerships, rawValue: stats.foreignPartnerships, icon: FaGlobe },
    { label: "Professional Partnerships", value: stats.professionalPartnerships, rawValue: stats.professionalPartnerships, icon: FaBriefcase },
    { label: "Campuses", value: stats.campuses, rawValue: stats.campuses, icon: FaUniversity },
    { label: "Qualified Lecturers", value: stats.lecturers, rawValue: stats.lecturers, icon: FaChalkboardTeacher },
    { label: "Student Population", value: stats.students, rawValue: stats.students, icon: FaUsers },
  ].filter(stat => stat.rawValue > 0); // Only show stats with non-zero values

  return (
    <section className="bg-primary text-white py-16" id="international">
      <div className="max-w-6xl mx-auto px-4 text-center space-y-10">
        <div>
          <p className="text-sm uppercase tracking-[0.5em] text-white/70">GIST is the Leading Higher Education Institute</p>
          <h2 className="text-3xl md:text-4xl font-bold mt-3">Experience {stats.years} years of excellence</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statList.map((stat) => (
            <div key={stat.label} className="p-8 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="flex items-center gap-4">
                <stat.icon className="w-10 h-10 text-white/70 shrink-0" />
                <p className="text-4xl md:text-5xl font-bold leading-none">{stat.rawValue >= 1000 ? `${stat.rawValue.toLocaleString()}+` : stat.value}</p>
              </div>
              <p className="text-sm uppercase tracking-[0.2em] text-white/80 font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;

