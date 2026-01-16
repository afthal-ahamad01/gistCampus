import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { useContent } from "../context/ContentContext";
import Logo from '../data/Assets/Logo.png';

// Floating header replicates nibm.lk, adds CTA buttons, and anchors to
// in-page sections. The logo always routes home.
const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProgrammesOpen, setIsProgrammesOpen] = useState(false);
  const { currentUser, userRole, logout } = useAuth();
  const { content } = useContent();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const programmesRef = useRef(null);

  const navLinks = [
    { label: "About", href: "/#about" },
    { label: "Programmes", href: "/#programmes" },
    { label: "My Results", href: "/results" },
    { label: "News & Events", href: "/#news" },
    { label: "Contact", href: "/#contact" },
  ];

  const handleLogoClick = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      setIsProfileOpen(false);
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (programmesRef.current && !programmesRef.current.contains(event.target)) {
        setIsProgrammesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getProfileLink = () => {
    if (userRole === "admin") return "/admin";
    if (userRole === "lecturer") return "/lecturer/dashboard";
    return "/student/profile";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="h-20 flex items-center justify-between gap-6">
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
          >
            <img
              src={Logo}
              alt="GIST Logo"
              className="h-12 w-auto"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs uppercase tracking-wider text-primary font-semibold">GIST Campus</p>
            </div>
          </button>

          <nav className="hidden xl:flex items-center gap-10 text-sm font-medium text-gray-600">
            {navLinks.map((link) => {
              if (link.label === "Programmes") {
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setIsProgrammesOpen(true)}
                    onMouseLeave={() => setIsProgrammesOpen(false)}
                  >
                    <div className="flex items-center gap-1 cursor-pointer">
                      <Link
                        to={link.href}
                        className="hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                      <svg
                        className={`w-4 h-4 transition-transform ${isProgrammesOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {isProgrammesOpen && content.programmes && content.programmes.length > 0 && (
                      <div className="absolute left-0 top-full pt-2">
                        <div className="w-56 bg-white rounded-xl shadow-lg py-2 border border-gray-100 transition-all duration-200 ease-in-out">
                          {content.programmes.map((programme) => (
                            <Link
                              key={programme.id}
                              to={`/programmes/${programme.id}`}
                              onClick={() => setIsProgrammesOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                            >
                              {programme.name || programme.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link key={link.label} to={link.href} className="hover:text-primary transition-colors">
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">            <Link
            to="/enroll"
            className="px-5 py-2.5 rounded-full bg-primary text-white font-semibold shadow-floating text-sm"
          >
            Enroll Now
          </Link>

            {currentUser ? (
              <div className="relative flex items-center gap-2" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
                >
                  <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold overflow-hidden border-2 border-white shadow-sm">
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      currentUser.email?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {currentUser.displayName || currentUser.email?.split("@")[0]}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>



                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg py-2 border border-gray-100 animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {currentUser.displayName || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                      <p className="text-xs text-primary font-medium mt-1 capitalize">{userRole}</p>
                    </div>

                    <Link
                      to={getProfileLink()}
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {userRole === "admin" ? "Admin Panel" : "My Profile"}
                    </Link>

                    {userRole === "student" && (
                      <>
                        <Link
                          to="/student/profile?tab=academic"
                          onClick={() => setIsProfileOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Academic Info
                        </Link>
                        <Link
                          to="/results"
                          onClick={() => setIsProfileOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          My Results
                        </Link>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-full border border-primary text-primary font-semibold text-sm"
              >
                Login
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsNavOpen((prev) => !prev)}
            className="xl:hidden p-3 rounded-full border border-gray-200"
          >
            <span className="sr-only">Toggle navigation</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isNavOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isNavOpen && (
        <div className="xl:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-6 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="block text-gray-700 font-medium"
                onClick={() => setIsNavOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4">
              <Link
                to="/enroll"
                onClick={() => setIsNavOpen(false)}
                className="w-full text-center px-4 py-3 rounded-full bg-primary text-white font-semibold"
              >
                Enroll Now
              </Link>

              {currentUser ? (
                <div className="space-y-2">
                  <Link
                    to={getProfileLink()}
                    onClick={() => setIsNavOpen(false)}
                    className="block w-full text-center px-4 py-3 rounded-full border border-gray-200 text-gray-700 font-semibold"
                  >
                    {userRole === "admin" ? "Admin Panel" : "My Profile"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center px-4 py-3 rounded-full border border-red-200 text-red-600 font-semibold"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsNavOpen(false)}
                  className="w-full text-center px-4 py-3 rounded-full border border-primary text-primary font-semibold"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;