import Hero from "../components/Hero";
import Faculties from "../components/Faculties";
import Courses from "../components/Courses";
import Stats from "../components/Stats";
import Campuses from "../components/Campuses";
import Affiliations from "../components/Affiliations";
import NewsEvents from "../components/NewsEvents";
import About from "../components/About";
import JobPortal from "../components/JobPortal";
import Consultancy from "../components/Consultancy";
import Gallery from "../components/Gallery";
import Alumni from "../components/Alumni";
import Programmes from "../components/Programmes";

// The home page stitches together every public module that mirrors the
// official NIBM landing experience.
const Home = () => {
  return (
    <div className="space-y-20 pb-20">
      <Hero />
      <Faculties />
      {/* <Courses /> */}
      <Stats />
      <Programmes />
      {/* <Campuses /> */}
      <Affiliations />
      <NewsEvents />
      <Gallery />
      <Alumni />
      <About />
      {/* <Consultancy /> */}
      <JobPortal />
    </div>
  );
};

export default Home;

