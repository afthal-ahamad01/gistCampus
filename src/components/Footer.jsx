import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import { useAuth } from "../context/AuthProvider";
import Logo from '../data/Assets/Logo.png';

// Footer replicates nibm.lk structure with mandated quick links.
const Footer = () => {
  const {
    content,
    content: { siteMeta },
  } = useContent();
  const { userRole } = useAuth();

  const quickLinks = [
    { label: "News & Events", href: "/#news" },
    { label: "Consultancy", href: "/#consultancy" },
    { label: "My Results", href: "/results" },
    { label: "Gallery", href: "/#gallery" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <img
            src={Logo}
            alt="GIST Logo"
            className="h-12 mb-4"
          />
          <p className="text-sm">{siteMeta.contact.address}</p>
          <p className="text-sm mt-2">{siteMeta.contact.hotline}</p>
          <p className="text-sm">{siteMeta.contact.email}</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
          <nav className="space-y-2">
            {quickLinks.map((link) => (
              <Link key={link.label} to={link.href} className="block hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Programmes</h4>
          <nav className="space-y-2">
            {content.programmes && content.programmes.slice(0, 5).map(prog => (
              <Link key={prog.id} to={`/programmes/${prog.id}`} className="block hover:text-white text-sm">
                {prog.name}
              </Link>
            ))}
            <Link to="/#programmes" className="block text-primary hover:text-white text-sm mt-2">
              View All
            </Link>
          </nav>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Follow Us</h4>
          <div className="space-y-2">
            {siteMeta.social.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="block hover:text-white">
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
        <p>© GIST 2025. All rights reserved.</p>
        <a href="" target="_blank" rel="noreferrer" className="text-white underline mt-2 inline-block">
          Privacy Policy
        </a>
        {userRole === "admin" && (
          <Link to="/admin" className="text-white underline mt-2 ml-4 inline-block">
            Admin Panel
          </Link>
        )}
      </div>
    </footer>
  );
};

export default Footer;
