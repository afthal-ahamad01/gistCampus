import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import { FaUserGraduate, FaScroll, FaBook, FaCertificate, FaAward, FaCheckCircle, FaProjectDiagram, FaLightbulb } from 'react-icons/fa';

const iconMap = {
    masters: FaUserGraduate,
    master: FaUserGraduate,
    postgraduate: FaUserGraduate,
    degree: FaScroll,
    degrees: FaScroll,
    "top-up": FaScroll,
    hnd: FaBook,
    diploma: FaCertificate,
    "adv-cert": FaAward,
    "advanced certificate": FaAward,
    certificate: FaCheckCircle,
    foundation: FaProjectDiagram,
    workshops: FaLightbulb,
};

const Programmes = () => {
    const { content } = useContent();

    return (
        <section id="programmes" className="max-w-6xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <p className="text-sm uppercase text-primary tracking-[0.5em] font-semibold">Study Options</p>
                <h2 className="text-3xl font-bold text-gray-900 mt-3">Find the right programme for you</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {content.programmes && content.programmes.map((prog) => {
                    const name = (prog.name || prog.label || "").toLowerCase();
                    const id = (prog.id || "").toLowerCase();

                    // Find first key that is contained in name or ID
                    const matchKey = Object.keys(iconMap).find(key =>
                        name.includes(key) || id.includes(key)
                    );

                    const Icon = iconMap[matchKey] || FaCheckCircle;

                    return (
                        <Link
                            key={prog.id}
                            to={`/programmes/${prog.id}`}
                            className="group relative bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden cursor-pointer flex flex-col items-center justify-center min-h-[160px] space-y-4"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <Icon className="relative z-10 text-4xl text-primary group-hover:text-white transition-colors duration-300" />
                            <h3 className="relative z-10 font-bold text-gray-800 group-hover:text-white transition-colors duration-300 text-sm uppercase tracking-wide">
                                {prog.name || prog.label}
                            </h3>
                        </Link>
                    );
                })}
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
