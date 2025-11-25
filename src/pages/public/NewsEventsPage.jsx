import { useContent } from "../../context/ContentContext";
import { Link } from "react-router-dom";

const NewsEventsPage = () => {
    const { content } = useContent();
    const news = content.newsEvents || [];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Banner */}
            <div className="relative h-[400px] w-full bg-gray-900 overflow-hidden">
                <img
                    src="https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg"
                    alt="News Banner"
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
                        Explore Our Latest News and Events
                    </h1>
                    <p className="text-xl text-gray-200 max-w-2xl animate-fade-in-up delay-100">
                        Check out our latest news articles and upcoming events below.
                    </p>
                </div>
            </div>

            {/* News Grid */}
            <div className="max-w-7xl mx-auto px-4 lg:px-6 mt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.map((item) => (
                        <Link
                            to={`/news-events/${item.id}`}
                            key={item.id}
                            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={item.coverImage || item.image || "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg"}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-900 shadow-sm">
                                    {new Date(item.date).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                                    {item.description}
                                </p>
                                <span className="text-primary font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                                    Read More <span className="text-lg">→</span>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {news.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl">No news or events found at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsEventsPage;
