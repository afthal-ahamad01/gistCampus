import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { seedData } from "../data/seedData";

// The ContentContext centralizes public-facing content that will be
// managed through the upcoming Admin Panel. Firestore documents
// automatically override the seed data when present so we keep the
// public site in sync with CMS updates.
const ContentContext = createContext({
  content: seedData,
  loading: true,
  error: null,
  searchCourses: () => [],
  getCourseBySlug: () => undefined,
  getFacultyById: () => undefined,
  certificates: [],
});

const collectionConfig = [
  { key: "siteMeta", path: "siteMeta" },
  { key: "heroSlides", path: "heroSlides" },
  { key: "faculties", path: "faculties" },
  { key: "programmes", path: "programmes" },
  { key: "courses", path: "courses" },
  { key: "stats", path: "stats" },
  { key: "campuses", path: "campuses" },
  { key: "foreignAffiliations", path: "foreignAffiliations" },
  { key: "professionalAffiliations", path: "professionalAffiliations" },
  { key: "newsEvents", path: "newsEvents" },
  { key: "gallery", path: "gallery" },
  { key: "testimonials", path: "testimonials" },
  { key: "certificates", path: "certificates" },
];

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(seedData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCollections = async () => {
      try {
        const entries = await Promise.all(
          collectionConfig.map(async ({ key, path }) => {
            const collectionRef = collection(db, path);
            const snapshot = await getDocs(collectionRef);
            if (snapshot.empty) {
              return [key, seedData[key]];
            }

            const docs = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            // Stats & other singleton objects are stored as the first doc.
            const value = docs.length === 1 && typeof docs[0] === "object" && !Array.isArray(seedData[key])
              ? docs[0]
              : docs;
            return [key, value];
          })
        );

        if (isMounted) {
          setContent((prev) => ({
            ...prev,
            ...Object.fromEntries(entries),
          }));
        }
      } catch (err) {
        console.error("Failed to fetch Firestore content:", err);
        if (isMounted) {
          setError("Content is displayed with fallback data. Firestore sync failed.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCollections();

    return () => {
      isMounted = false;
    };
  }, []);

  const facultyMap = useMemo(() => {
    return content.faculties.reduce((acc, faculty) => {
      acc[faculty.id] = faculty;
      return acc;
    }, {});
  }, [content.faculties]);

  const searchCourses = useCallback(
    (term) => {
      if (!term) return content.courses;
      const normalized = term.toLowerCase();
      return content.courses.filter(
        (course) =>
          course.title.toLowerCase().includes(normalized) ||
          course.description.toLowerCase().includes(normalized) ||
          facultyMap[course.facultyId]?.title.toLowerCase().includes(normalized)
      );
    },
    [content.courses, facultyMap]
  );

  const getCourseBySlug = useCallback(
    (slug) => content.courses.find((course) => course.slug === slug),
    [content.courses]
  );
  const getFacultyById = useCallback((id) => facultyMap[id], [facultyMap]);

  const value = {
    content,
    loading,
    error,
    searchCourses,
    getCourseBySlug,
    getFacultyById,
    certificates: content.certificates,
  };

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export const useContent = () => useContext(ContentContext);

