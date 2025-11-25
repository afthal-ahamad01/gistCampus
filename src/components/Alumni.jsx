import { useContent } from "../context/ContentContext";

// Alumni/testimonials section anchors the navigation link.
const Alumni = () => {
  const { content } = useContent();
  if (!content.testimonials.length) return null;

  return (
    <section id="alumni" className="max-w-6xl mx-auto px-4">
      <div className="bg-white rounded-3xl shadow-floating p-8 space-y-6">
        <div className="text-center">
          <p className="text-sm uppercase text-primary tracking-[0.5em] font-semibold">Alumni Voices</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">See why we are No. 1 in Sri Lanka</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {content.testimonials.map((testimonial) => (
            <article key={testimonial.id} className="p-6 rounded-2xl border border-gray-100 space-y-4 flex flex-col h-full">
              <p className="text-gray-600 italic flex-grow">“{testimonial.quote}”</p>
              <div className="flex items-center gap-4">
                {testimonial.image && (
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover bg-gray-100" />
                )}
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.programme}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Alumni;





