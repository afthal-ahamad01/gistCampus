// Simple CTA referencing the Consultancy link requested in the footer.
const Consultancy = () => (
  <section id="consultancy" className="max-w-6xl mx-auto px-4">
    <div className="bg-white rounded-3xl shadow-floating p-8 grid md:grid-cols-2 gap-6 items-center">
      <div>
        <p className="text-sm uppercase tracking-[0.5em] text-primary font-semibold">Consultancy</p>
        <h2 className="text-3xl font-bold text-gray-900 mt-2">Industry Consultancy & Executive Training</h2>
        <p className="text-gray-600 mt-3">
          Partner with GIST Campus experts for strategy, digital transformation, productivity and quality consulting,
          and bespoke executive programmes.
        </p>
      </div>
      <div className="space-y-4">
        <p className="text-gray-600">Email: consultancy@gistcampus.lk</p>
        <p className="text-gray-600">Hotline: +94 117 321 000</p>
        <a
          href="mailto:consultancy@gistcampus.lk"
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-full font-semibold"
        >
          Contact Consultancy Desk
        </a>
      </div>
    </div>
  </section>
);

export default Consultancy;

