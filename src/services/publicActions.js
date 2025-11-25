import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";

// Helper to keep admin notifications decoupled. When the Cloud Function
// is wired, callables can be dropped in here without touching UI logic.
const notifyAdmin = async ({ subject, payload }) => {
  try {
    await addDoc(collection(db, "notifications"), {
      subject,
      payload,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn("Notification queue unavailable, fallback to console");
    console.info(subject, payload);
  }
};

export const submitEnrollment = async (formData) => {
  const docRef = await addDoc(collection(db, "enrollments"), {
    ...formData,
    createdAt: serverTimestamp(),
  });

  await notifyAdmin({
    subject: "New Enrollment",
    payload: formData,
  });

  return docRef.id;
};

export const verifyCertificateNumber = async (certificateNo) => {
  const certificateQuery = query(
    collection(db, "certificates"),
    where("certificateNo", "==", certificateNo.trim())
  );
  const snapshot = await getDocs(certificateQuery);

  if (snapshot.empty) {
    return { exists: false };
  }

  return {
    exists: true,
    ...snapshot.docs[0].data(),
  };
};

export const submitTranscriptRequest = async (payload) => {
  const docRef = await addDoc(collection(db, "transcriptRequests"), {
    ...payload,
    createdAt: serverTimestamp(),
  });

  await notifyAdmin({
    subject: "Transcript Request",
    payload,
  });

  return docRef.id;
};

export const fetchCourseBySlug = async (slug) => {
  const courseDoc = await getDoc(doc(db, "courses", slug));
  if (courseDoc.exists()) {
    return { id: courseDoc.id, ...courseDoc.data() };
  }
  return null;
};

