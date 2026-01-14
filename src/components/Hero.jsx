import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { useContent } from "../context/ContentContext";

// Hero carousel displays only the sliding imagery as requested.
const Hero = () => {
  const { content } = useContent();

  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000 }}
        loop
        className="h-[50vh] md:h-[85vh]"
      >
        {content.heroSlides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-center px-4">
                <div className="space-y-4">
                  <p className="text-white text-lg md:text-2xl font-semibold tracking-wide">
                    {slide.title}
                  </p>
                  <a
                    href="/#programmes"
                    className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-primary text-white text-base md:text-lg font-bold shadow-lg hover:bg-opacity-90 transition-all transform hover:-translate-y-1"
                  >
                    Explore Programmes
                  </a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;

