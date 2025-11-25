import { useContent } from "../context/ContentContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Slider that can be fully managed via the Admin Panel. Positioned at
// the bottom of home to match client brief.
const Gallery = () => {
  const { content } = useContent();

  return (
    <section id="gallery" className="max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm uppercase text-primary font-semibold tracking-widest">Gallery</p>
          <h2 className="text-3xl font-bold text-gray-900">Life at GIST Campus</h2>
        </div>
      </div>
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000 }}
        pagination={{ clickable: true }}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {content.gallery.map((item) => (
          <SwiperSlide key={item.id}>
            <article className="bg-white rounded-3xl shadow overflow-hidden h-full flex flex-col">
              <img src={item.image} alt={item.caption} className="h-56 w-full object-cover" />
              <p className="p-4 text-sm font-medium text-gray-700 flex-1">{item.caption}</p>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Gallery;





