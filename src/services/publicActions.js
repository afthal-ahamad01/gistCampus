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
  const trimmedNo = certificateNo.trim();

  // 1. Check official Certificates collection
  const certificateQuery = query(
    collection(db, "certificates"),
    where("certificateNo", "==", trimmedNo)
  );
  const snapshot = await getDocs(certificateQuery);

  if (!snapshot.empty) {
    return {
      exists: true,
      ...snapshot.docs[0].data(),
    };
  }

  // 2. Fallback: Check Students collection (for active student records)
  const studentQuery = query(
    collection(db, "students"),
    where("certificateNumber", "==", trimmedNo)
  );
  const studentSnapshot = await getDocs(studentQuery);

  if (!studentSnapshot.empty) {
    const student = studentSnapshot.docs[0].data();
    return {
      exists: true,
      certificateNo: student.certificateNumber,
      studentName: student.fullName,
      programme: student.programme,
      year: student.completionYear || new Date().getFullYear().toString(), // Fallback year
      source: 'student_record'
    };
  }

  return { exists: false };
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

