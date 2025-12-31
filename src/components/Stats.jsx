import { useContent } from "../context/ContentContext";

// Shared KPI strip reused in About page as well (the Admin edits sync
// via Firebase).
const Stats = () => {
  const {
    content: { stats },
  } = useContent();

  const statList = [
    { label: "Years of excellence", value: `${stats.years}` },
    // { label: "Foreign Partnerships", value: `${stats.foreignPartnerships}` },
    // { label: "Professional Partnerships", value: `${stats.professionalPartnerships}` },
    { label: "Campuses", value: `${stats.campuses}` },
    { label: "Qualified Lecturers", value: `${stats.lecturers.toLocaleString()}+` },
    { label: "Student Population", value: `${stats.students.toLocaleString()}+` },
  ];

  return (
    <section className="bg-primary text-white py-16" id="international">
      <div className="max-w-6xl mx-auto px-4 text-center space-y-10">
        <div>
          <p className="text-sm uppercase tracking-[0.5em] text-white/70">GIST is the Leading Higher Education Institute</p>
          <h2 className="text-3xl md:text-4xl font-bold mt-3">Experience 15 years of excellence</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {statList.map((stat) => (
            <div key={stat.label} className="p-6 rounded-2xl bg-white/10 backdrop-blur border border-white/20">
              <p className="text-4xl font-bold">{stat.value}</p>
              <p className="text-sm uppercase tracking-widest mt-2 text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;

