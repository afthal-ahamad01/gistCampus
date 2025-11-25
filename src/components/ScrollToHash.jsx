import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Smoothly scrolls to hash targets when navigation occurs using links
// such as /#faculties. Keeps UX aligned with the official site.
const ScrollToHash = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const id = hash.replace("#", "");
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hash, pathname]);

  return null;
};

export default ScrollToHash;

