import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { useState } from "react";

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Failed to logout", error);
        }
    };

    const navItems = [
        { label: "Dashboard", path: "/admin" },
        { label: "Manage Content", path: "/admin/content" },
        { label: "Manage Programmes", path: "/admin/programmes" },
        { label: "Manage Courses", path: "/admin/courses" },
        { label: "Students", path: "/admin/students" },
        { label: "Lecturers", path: "/admin/lecturers" },
        { label: "Transcripts", path: "/admin/transcripts" },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg shadow-lg"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMobileMenuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-40
                w-64 bg-white shadow-md flex flex-col
                transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-4 md:p-6 border-b">
                    <h1 className="text-xl md:text-2xl font-bold text-primary">GIST Admin</h1>
                </div>
                <nav className="flex-1 p-3 md:p-4 space-y-1 md:space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base ${location.pathname === item.path
                                ? "bg-primary text-white"
                                : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-3 md:p-4 border-t space-y-2">
                    <Link
                        to="/"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2 w-full px-3 md:px-4 py-2 text-sm md:text-base text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="hidden md:inline">Return to Website</span>
                        <span className="md:hidden">Website</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full px-3 md:px-4 py-2 text-sm md:text-base text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pt-16 lg:pt-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
