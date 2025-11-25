import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToHash from "../components/ScrollToHash";

// The layout keeps the floating header + footer consistent while the
// routed pages render inside the <main> element.
const PublicLayout = () => {
  return (
    <div className="bg-gray-50 text-gray-900 antialiased min-h-screen">
      <Header />
      <ScrollToHash />
      <main className="mt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;

