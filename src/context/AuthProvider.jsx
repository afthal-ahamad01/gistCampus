import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const AuthContext = createContext({
  currentUser: null,
  userRole: null,
  loading: true,
  logout: () => Promise.resolve(),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch user role from Firestore
        // We check 'admins', 'lecturers', and 'students' collections
        // For now, let's assume we store role in a 'users' collection or similar
        // OR we can check each collection.
        // A common pattern is to have a 'users' collection with a 'role' field,
        // or check if the ID exists in specific collections.
        
        // Strategy: Check 'admins' first, then 'lecturers', then 'students'
        // This is a bit expensive, better to have a claim or a central user doc.
        // For this MVP, let's try to find the user in these collections.
        
        try {
            // Check Admin
            const adminDoc = await getDoc(doc(db, "admins", user.uid));
            if (adminDoc.exists()) {
                setUserRole("admin");
            } else {
                // Check Lecturer
                const lecturerDoc = await getDoc(doc(db, "lecturers", user.uid));
                if (lecturerDoc.exists()) {
                    setUserRole("lecturer");
                } else {
                    // Check Student
                    const studentDoc = await getDoc(doc(db, "students", user.uid));
                    if (studentDoc.exists()) {
                        setUserRole("student");
                    } else {
                        setUserRole("guest"); // Authenticated but no role found
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching user role:", error);
            setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    userRole,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
