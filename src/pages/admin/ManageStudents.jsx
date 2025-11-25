import { useState, useEffect } from "react";
import { db, firebaseConfig } from "../../config/firebase";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, serverTimestamp, setDoc as apiSetDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthProvider";
import { useContent } from "../../context/ContentContext";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const ManageStudents = () => {
    const { currentUser } = useAuth();
    const { content } = useContent();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

    // Course Enrollment State
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState("");
    const [selectedProgramType, setSelectedProgramType] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        if (editingStudent) {
            setEnrolledCourses(editingStudent.enrolledCourses || []);
        } else {
            setEnrolledCourses([]);
        }
    }, [editingStudent]);

    const fetchStudents = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "students"));
            const studentsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setStudents(studentsData);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCourse = () => {
        if (!selectedCourse) return;

        const course = content.courses.find(c => c.id === selectedCourse);
        if (!course) return;

        // Check if already enrolled
        if (enrolledCourses.some(c => c.courseId === course.id)) {
            alert("Student is already enrolled in this course.");
            return;
        }

        const newEnrollment = {
            courseId: course.id,
            courseTitle: course.title,
            facultyId: selectedFaculty,
            programTypeId: selectedProgramType,
            enrolledDate: new Date().toISOString(),
            status: "Enrolled" // Default status
        };

        setEnrolledCourses([...enrolledCourses, newEnrollment]);
        setSelectedCourse(""); // Reset selection
    };

    const handleRemoveCourse = (courseId) => {
        setEnrolledCourses(enrolledCourses.filter(c => c.courseId !== courseId));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        // Boolean conversions
        data.isActive = data.isActive === "on";

        // Metadata updates
        const timestamp = serverTimestamp();
        data.lastUpdated = timestamp;

        // Add enrolled courses
        data.enrolledCourses = enrolledCourses;

        let newUserId = null;

        try {
            if (!editingStudent) {
                // CREATE NEW STUDENT
                data.createdDate = timestamp;
                data.createdBy = currentUser?.email || "admin";
                data.role = "student";

                // 1. Create Authentication User (Secondary App Workaround)
                if (data.tempPassword) {
                    const secondaryApp = initializeApp(firebaseConfig, "Secondary");
                    const secondaryAuth = getAuth(secondaryApp);
                    try {
                        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, data.email, data.tempPassword);
                        newUserId = userCredential.user.uid;
                        await deleteApp(secondaryApp); // Cleanup
                    } catch (authError) {
                        await deleteApp(secondaryApp); // Cleanup on error too
                        console.error("Auth Error:", authError);
                        alert(`Failed to create login account: ${authError.message}`);
                        return; // Stop if auth fails
                    }
                } else {
                    alert("Temporary Password is required for new students.");
                    return;
                }

                // 2. Create Firestore Document with same UID
                if (newUserId) {
                    await apiSetDoc(doc(db, "students", newUserId), data);
                } else {
                    // Fallback if something weird happened, though we should have returned above
                    await addDoc(collection(db, "students"), data);
                }

            } else {
                // UPDATE EXISTING STUDENT
                // Note: We don't update password here. That requires Admin SDK or user action.
                delete data.tempPassword; // Don't save password to DB
                await updateDoc(doc(db, "students", editingStudent.id), data);
            }

            setIsFormOpen(false);
            setEditingStudent(null);
            fetchStudents();
            alert("Student saved successfully!");
        } catch (error) {
            console.error("Error saving student:", error);
            alert("Failed to save student.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            try {
                await deleteDoc(doc(db, "students", id));
                fetchStudents();
            } catch (error) {
                console.error("Error deleting student:", error);
            }
        }
    };

    // Filtered lists for dropdowns
    const filteredProgrammes = selectedFaculty
        ? content.programmes // In a real app, we might filter programmes by faculty if there's a mapping
        : content.programmes;

    const filteredCourses = content.courses.filter(course => {
        let match = true;
        if (selectedFaculty) match = match && course.facultyId === selectedFaculty;
        if (selectedProgramType) match = match && course.programTypeId === selectedProgramType;
        return match;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
                <button
                    onClick={() => {
                        setEditingStudent(null);
                        setIsFormOpen(true);
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
                >
                    Add Student
                </button>
            </div>

            {!isFormOpen ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    {loading ? (
                        <p className="p-6 text-center">Loading...</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name / ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Academic
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {students.map((student) => (
                                        <tr key={student.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{student.fullName}</div>
                                                <div className="text-sm text-gray-500">{student.studentId}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{student.email}</div>
                                                <div className="text-sm text-gray-500">{student.mobile}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{student.programme}</div>
                                                <div className="text-sm text-gray-500">{student.batch}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {student.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => {
                                                        setEditingStudent(student);
                                                        setIsFormOpen(true);
                                                    }}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(student.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white shadow sm:rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">
                            {editingStudent ? "Edit Student Profile" : "Create New Student Account"}
                        </h2>
                        <button
                            onClick={() => setIsFormOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-8">
                        {/* Basic Info */}
                        <Section title="Basic Information">
                            <Input label="Full Name" name="fullName" defaultValue={editingStudent?.fullName} required />
                            <Input label="Student ID" name="studentId" defaultValue={editingStudent?.studentId} required />
                            <Input label="Date of Birth" name="dob" type="date" defaultValue={editingStudent?.dob} />
                            <Select label="Gender" name="gender" defaultValue={editingStudent?.gender} options={["Male", "Female", "Other"]} />
                            <Input label="NIC" name="nic" defaultValue={editingStudent?.nic} />
                            <Input label="Profile Photo URL" name="photoUrl" defaultValue={editingStudent?.photoUrl} placeholder="https://..." />
                        </Section>

                        {/* Contact Info */}
                        <Section title="Contact Details">
                            <Input label="Email (Username)" name="email" type="email" defaultValue={editingStudent?.email} required />
                            <Input label="Mobile Number" name="mobile" defaultValue={editingStudent?.mobile} />
                            <Input label="Address" name="address" defaultValue={editingStudent?.address} />
                            <Input label="City" name="city" defaultValue={editingStudent?.city} />
                        </Section>

                        {/* Academic Info */}
                        <Section title="Academic Information">
                            <Input label="Programme" name="programme" defaultValue={editingStudent?.programme} />
                            <Input label="Faculty" name="faculty" defaultValue={editingStudent?.faculty} />
                            <Input label="Batch" name="batch" defaultValue={editingStudent?.batch} />
                            <Input label="Enrollment Date" name="enrollmentDate" type="date" defaultValue={editingStudent?.enrollmentDate} />
                        </Section>

                        {/* Course Enrollment Section */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Enrolled Courses</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Faculty</label>
                                    <select
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                        value={selectedFaculty}
                                        onChange={(e) => {
                                            setSelectedFaculty(e.target.value);
                                            setSelectedCourse(""); // Reset course when faculty changes
                                        }}
                                    >
                                        <option value="">Select Faculty</option>
                                        {content.faculties.map(f => (
                                            <option key={f.id} value={f.id}>{f.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Programme Type</label>
                                    <select
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                        value={selectedProgramType}
                                        onChange={(e) => {
                                            setSelectedProgramType(e.target.value);
                                            setSelectedCourse(""); // Reset course when type changes
                                        }}
                                    >
                                        <option value="">Select Type</option>
                                        {content.programmes.map(p => (
                                            <option key={p.id} value={p.id}>{p.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Course</label>
                                    <select
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                        value={selectedCourse}
                                        onChange={(e) => setSelectedCourse(e.target.value)}
                                        disabled={!selectedFaculty && !selectedProgramType}
                                    >
                                        <option value="">Select Course</option>
                                        {filteredCourses.map(c => (
                                            <option key={c.id} value={c.id}>{c.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end mb-6">
                                <button
                                    type="button"
                                    onClick={handleAddCourse}
                                    disabled={!selectedCourse}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Add Course
                                </button>
                            </div>

                            {/* Enrolled Courses List */}
                            {enrolledCourses.length > 0 ? (
                                <div className="space-y-2">
                                    {enrolledCourses.map((enrollment, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-white p-3 rounded border border-gray-200">
                                            <div>
                                                <p className="font-medium text-gray-900">{enrollment.courseTitle}</p>
                                                <p className="text-xs text-gray-500">
                                                    {content.faculties.find(f => f.id === enrollment.facultyId)?.title} • {content.programmes.find(p => p.id === enrollment.programTypeId)?.label}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveCourse(enrollment.courseId)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">No courses enrolled yet.</p>
                            )}
                        </div>

                        {/* Login & Status */}
                        <Section title="Login & Status">
                            {!editingStudent && (
                                <Input
                                    label="Temporary Password"
                                    name="tempPassword"
                                    placeholder="User must reset on first login"
                                    note="Note: This will create the login account."
                                />
                            )}
                            <div className="flex items-center mt-6">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    defaultChecked={editingStudent?.isActive ?? true}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-900">Active Account</label>
                            </div>
                        </Section>

                        {/* Support & Verification */}
                        <Section title="Support & Verification">
                            <Input label="Guardian Info" name="guardianInfo" defaultValue={editingStudent?.guardianInfo} placeholder="Name & Contact" />
                            <Input label="Scholarship Status" name="scholarshipStatus" defaultValue={editingStudent?.scholarshipStatus} />
                            <Input label="Certificate Number" name="certificateNumber" defaultValue={editingStudent?.certificateNumber} />
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Notes</label>
                                <textarea
                                    name="notes"
                                    defaultValue={editingStudent?.notes}
                                    rows="3"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                />
                            </div>
                        </Section>

                        {/* Metadata Display (Read Only) */}
                        {editingStudent && (
                            <div className="bg-gray-50 p-4 rounded-lg text-xs text-gray-500 space-y-1">
                                <p>Created By: {editingStudent.createdBy}</p>
                                <p>Created Date: {editingStudent.createdDate?.toDate?.().toLocaleDateString() || "N/A"}</p>
                                <p>Last Updated: {editingStudent.lastUpdated?.toDate?.().toLocaleDateString() || "N/A"}</p>
                            </div>
                        )}

                        <div className="flex justify-end space-x-3 pt-6 border-t">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsFormOpen(false);
                                    setEditingStudent(null);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90"
                            >
                                Save Student Profile
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

const Section = ({ title, children }) => (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </div>
);

const Input = ({ label, name, type = "text", defaultValue, required, placeholder, note }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            name={name}
            defaultValue={defaultValue}
            required={required}
            placeholder={placeholder}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
        {note && <p className="text-xs text-gray-500 mt-1">{note}</p>}
    </div>
);

const Select = ({ label, name, defaultValue, options }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <select
            name={name}
            defaultValue={defaultValue}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        >
            <option value="">Select...</option>
            {options.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
            ))}
        </select>
    </div>
);

export default ManageStudents;
