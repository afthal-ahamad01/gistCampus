import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext";

const Programmes = () => {
    const { content } = useContent();

    return (
        <section id="programmes" className="max-w-6xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <p className="text-sm uppercase text-primary tracking-[0.5em] font-semibold">Study Options</p>
                <h2 className="text-3xl font-bold text-gray-900 mt-3">Find the right programme for you</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {content.programmes && content.programmes.map((prog) => (
                    <div
                        key={prog.id}
                        className="group relative bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden cursor-default"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <h3 className="relative z-10 font-semibold text-gray-800 group-hover:text-white transition-colors duration-300">
                            {prog.name}
                        </h3>
                    </div>
                ))}
            </div>

            <div className="text-center mt-12">
                <Link
                    to="/enroll"
                    className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-primary text-white font-semibold shadow-lg hover:bg-opacity-90 hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                    Apply Now
                </Link>
            </div>
        </section>
    );
};

export default Programmes;
