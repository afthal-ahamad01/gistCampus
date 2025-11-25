import { useContent } from "../context/ContentContext";

// Campus cards show contact numbers and tag lines, matching nibm.lk.
const Campuses = () => {
  const { content } = useContent();

  return (
    <section id="campuses" className="max-w-6xl mx-auto px-4 space-y-8">
      <div className="text-center">
        <p className="text-sm uppercase text-primary font-semibold tracking-[0.3em]">Campuses</p>
        <h2 className="text-4xl font-bold text-gray-900 mt-4">Powering great minds islandwide</h2>
        <p className="text-gray-600 mt-3">8 campuses located across the country for easy access to quality education.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {content.campuses.map((campus) => (
          <article key={campus.id} className="relative overflow-hidden rounded-3xl shadow-floating">
            <img src={campus.image} alt={campus.name} className="h-64 w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <p className="text-xs uppercase tracking-widest text-white/70">{campus.tagline}</p>
              <h3 className="text-2xl font-semibold">{campus.name}</h3>
              <p className="text-sm text-white/80 mt-1">{campus.contact}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Campuses;

