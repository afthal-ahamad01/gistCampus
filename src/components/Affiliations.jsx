import { useContent } from "../context/ContentContext";

// Foreign + professional affiliations (logos optional). Data is managed
// from Firebase collections.
const Affiliations = () => {
  const { content } = useContent();

  return (
    <section className="max-w-6xl mx-auto px-4 space-y-12">
      <div>
        <p className="text-sm uppercase tracking-[0.5em] text-primary font-semibold">Foreign Affiliations</p>
        <h2 className="text-3xl font-bold text-gray-900 mt-3">Global university partnerships</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-6">
          {content.foreignAffiliations.map((partner) => (
            <article key={partner.id} className="relative p-4 md:p-6 border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
              {partner.image && (
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                  <img src={partner.image} alt={partner.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="relative z-10">
                <p className="text-xs uppercase text-gray-500">{partner.country}</p>
                <p className="text-lg font-semibold text-gray-900 mt-2">{partner.name}</p>
                {partner.image && (
                  <img src={partner.image} alt={partner.name} className="h-12 mt-4 object-contain" />
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm uppercase tracking-[0.5em] text-primary font-semibold">Professional Affiliations</p>
        <h2 className="text-3xl font-bold text-gray-900 mt-3">100+ Professional Partnerships</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6">
          {content.professionalAffiliations.map((partner) => (
            <div key={partner.id} className="p-3 md:p-4 rounded-2xl border border-dashed border-gray-200 text-center text-gray-700 flex flex-col items-center justify-center h-full">
              {partner.image && (
                <img src={partner.image} alt={partner.name} className="h-12 md:h-16 object-contain mb-2 md:mb-3" />
              )}
              <span className="font-medium">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Affiliations;

