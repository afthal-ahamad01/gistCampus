import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext";

// Latest news cards, matches site copy and keeps a CTA for "View All".
const NewsEvents = () => {
  const { content } = useContent();

  return (
    <section id="news" className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm uppercase text-primary tracking-[0.5em] font-semibold">News & Events</p>
          <h2 className="text-4xl font-bold text-gray-900 mt-4">Latest at GIST Campus</h2>
          <p className="text-gray-600 mt-3">Stay updated with competitions, talks, launches, and student life.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {content.newsEvents.map((item) => (
            <Link to={`/news-events/${item.id}`} key={item.id} className="relative bg-white rounded-3xl shadow overflow-hidden flex flex-col h-80 group cursor-pointer">
              {item.image && (
                <div className="absolute inset-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                </div>
              )}
              <div className="relative z-10 p-6 flex flex-col h-full justify-end text-white">
                <p className="text-xs uppercase font-semibold tracking-wider text-primary-light mb-2">{item.date}</p>
                <h3 className="text-xl font-bold leading-tight mb-2">{item.title}</h3>
                <p className="text-sm text-gray-200 line-clamp-2">{item.description}</p>
                <span className="mt-4 text-left text-primary-light font-semibold text-sm hover:text-white transition-colors">Learn More →</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/news-events"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-primary text-white font-semibold hover:bg-opacity-90 transition-all"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
};


export default NewsEvents;






