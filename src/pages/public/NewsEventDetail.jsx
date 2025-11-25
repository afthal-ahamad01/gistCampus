import { useParams, useNavigate } from "react-router-dom";
import { useContent } from "../../context/ContentContext";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const NewsEventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { content } = useContent();
    const [event, setEvent] = useState(null);

    useEffect(() => {
        if (content.newsEvents) {
            const foundEvent = content.newsEvents.find((e) => e.id === id);
            if (foundEvent) {
                setEvent(foundEvent);
            }
        }
    }, [id, content.newsEvents]);

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    let galleryImages = [];
    if (Array.isArray(event.images) && event.images.length > 0) {
        galleryImages = event.images;
    } else if (typeof event.images === "string" && event.images.trim().length > 0) {
        // Handle case where images might be saved as a comma-separated string
        galleryImages = event.images.split(",").map(url => url.trim()).filter(url => url);
    } else {
        galleryImages = [event.coverImage || event.image || "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg"];
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Banner Image */}
            <div className="relative h-[50vh] w-full bg-gray-900">
                <img
                    src={event.coverImage || event.image || "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg"}
                    alt={event.title}
                    className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-7xl mx-auto">
                    <span className="inline-block px-4 py-1 bg-primary text-white text-sm font-semibold rounded-full mb-4">
                        {new Date(event.date).toLocaleDateString()}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                        {event.title}
                    </h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Description */}
                <div className="prose prose-lg max-w-none text-gray-700 mb-16">
                    <p className="text-xl leading-relaxed">{event.description}</p>
                </div>

                {/* Image Slider */}
                {galleryImages.length > 0 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-primary pl-4">
                            Event Gallery
                        </h2>
                        <div className="rounded-2xl overflow-hidden shadow-2xl">
                            <Swiper
                                modules={[Navigation, Pagination, Autoplay]}
                                spaceBetween={0}
                                slidesPerView={1}
                                navigation
                                pagination={{ clickable: true }}
                                autoplay={{ delay: 5000 }}
                                loop={true}
                                className="h-[400px] md:h-[600px] w-full"
                            >
                                {galleryImages.map((img, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="relative w-full h-full bg-gray-100">
                                            <img
                                                src={img}
                                                alt={`Gallery ${index + 1}`}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                )}

                <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                    <button
                        onClick={() => navigate("/news-events")}
                        className="text-primary font-semibold hover:underline flex items-center justify-center gap-2"
                    >
                        ← Back to News & Events
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewsEventDetail;
