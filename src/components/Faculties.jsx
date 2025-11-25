import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext";

// Faculty grid links directly to nibm.lk while also exposing an
// internal detail page for GIST-specific copy.
const Faculties = () => {
  const { content } = useContent();

  return (
    <section id="faculties" className="max-w-6xl mx-auto px-4" aria-labelledby="faculties-heading">
      <div className="text-center mb-12">
        <p className="text-sm uppercase text-primary font-semibold tracking-widest">Faculties</p>
        <h2 id="faculties-heading" className="text-4xl font-bold text-gray-900">
          Choose your desired course
        </h2>
        <p className="text-gray-600 mt-3 max-w-3xl mx-auto">
          Business, Computing, Engineering, Language, Design, Humanities, Business Analytics Center, and Productivity &
          Quality Center.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {content.faculties.map((faculty) => (
          <article
            key={faculty.id}
            className="group relative bg-white rounded-3xl shadow-floating overflow-hidden flex flex-col h-72 md:h-96"
          >
            <div className="absolute inset-0">
              <img
                src={faculty.heroImage}
                alt={faculty.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            </div>

            <div className="relative z-10 flex-1 p-8 flex flex-col justify-end text-white">
              <h3 className="text-2xl font-bold mb-2">{faculty.title}</h3>
              <p className="text-gray-200 text-sm line-clamp-3 mb-4">{faculty.excerpt}</p>

              <Link
                to={`/faculties/${faculty.id}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-light hover:text-white transition-colors"
              >
                More Details →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Faculties;