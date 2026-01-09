
import { useState, useEffect } from "react";
import { db, firebaseConfig } from "../../config/firebase";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, serverTimestamp, setDoc as apiSetDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthProvider";
import { useContent } from "../../context/ContentContext";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import ImageUpload from "../../components/admin/ImageUpload";
import CustomAlert from "../../components/CustomAlert";

const ManageLecturers = () => {
    const { currentUser } = useAuth();
    const { content } = useContent(); // Access public courses
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingLecturer, setEditingLecturer] = useState(null);
    const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState("");
    const [selectedCourses, setSelectedCourses] = useState([]);

    // Alert State
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: "",
        message: "",
        type: "success",
        onConfirm: null
    });

    const showAlert = (title, message, type = "success", onConfirm = null) => {
        setAlertConfig({ isOpen: true, title, message, type, onConfirm });
    };

    const closeAlert = () => {
        setAlertConfig(prev => ({ ...prev, isOpen: false }));
    };

    useEffect(() => {
        fetchLecturers();
    }, []);

    const fetchLecturers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "lecturers"));
            const lecturersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setLecturers(lecturersData);
        } catch (error) {
            console.error("Error fetching lecturers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (lecturer) => {
        setEditingLecturer(lecturer);
        setUploadedPhotoUrl(lecturer?.photoUrl || "");

        // Initialize selected courses
        if (lecturer?.coursesAssigned && Array.isArray(lecturer.coursesAssigned)) {
            setSelectedCourses(lecturer.coursesAssigned);
        } else {
            setSelectedCourses([]);
        }

        setIsFormOpen(true);
    };

    const handleCourseToggle = (courseId) => {
        setSelectedCourses(prev => {
            if (prev.includes(courseId)) {
                return prev.filter(id => id !== courseId);
            } else {
                return [...prev, courseId];
            }
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        data.photoUrl = uploadedPhotoUrl;
        data.isActive = data.isActive === "on";
        data.coursesAssigned = selectedCourses; // Save array of IDs

        const timestamp = serverTimestamp();
        data.lastUpdated = timestamp;

        try {
            if (!editingLecturer) {
                // CREATE NEW LECTURER
                data.createdDate = timestamp; // Server timestamp
                data.createdBy = currentUser?.email || "admin";
                data.role = "lecturer";
                // Client-side fallback for immediate UI update
                data.createdDate = new Date();
            }

            if (data.experience) data.experience = Number(data.experience);
            // data.dateOfJoining is kept as string

            if (editingLecturer) {
                await updateDoc(doc(db, "lecturers", editingLecturer.id), data);
            } else {
                await addDoc(collection(db, "lecturers"), data);
            }

            setIsFormOpen(false);
            setEditingLecturer(null);
            showAlert("Success!", "Lecturer profile saved successfully.", "success");
            fetchLecturers();
        } catch (error) {
            console.error("Error saving lecturer:", error);
            showAlert("Error", "Failed to save lecturer profile.", "error");
        }
    };

    const confirmDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "lecturers", id));
            showAlert("Deleted!", "Lecturer deleted successfully.", "success");
            fetchLecturers();
        } catch (error) {
            console.error("Error deleting lecturer:", error);
            showAlert("Error", "Failed to delete lecturer.", "error");
        }
    };

    const handleDelete = (id) => {
        showAlert(
            "Are you sure?",
            "Do you really want to delete this lecturer profile?",
            "confirm",
            () => confirmDelete(id)
        );
    };

    return (
        <div className="space-y-6">
            <CustomAlert
                isOpen={alertConfig.isOpen}
                onClose={closeAlert}
                onConfirm={alertConfig.onConfirm}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
            />
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Lecturer Management</h1>
                <button
                    onClick={() => {
                        setEditingLecturer(null);
                        setUploadedPhotoUrl("");
                        setSelectedCourses([]);
                        setIsFormOpen(true);
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
                >
                    Add Lecturer
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
                                            Designation
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Faculty / Campus
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
                                    {lecturers.map((lecturer) => (
                                        <tr key={lecturer.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{lecturer.fullName}</div>
                                                <div className="text-sm text-gray-500">{lecturer.lecturerId}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{lecturer.designation}</div>
                                                <div className="text-sm text-gray-500">{lecturer.employmentType}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{lecturer.faculty}</div>
                                                <div className="text-sm text-gray-500">{lecturer.campus}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px - 2 inline - flex text - xs leading - 5 font - semibold rounded - full ${lecturer.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                        } `}
                                                >
                                                    {lecturer.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleEdit(lecturer)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(lecturer.id)}
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
                            {editingLecturer ? "Edit Lecturer Profile" : "Create New Lecturer Account"}
                        </h2>
                        <button
                            onClick={() => setIsFormOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-8">
                        {/* Personal Info */}
                        <Section title="Personal Information">
                            <Input label="Full Name" name="fullName" defaultValue={editingLecturer?.fullName} required />
                            <Input label="Lecturer ID" name="lecturerId" defaultValue={editingLecturer?.lecturerId} required placeholder="e.g., LEC001" />
                            <Select label="Gender" name="gender" defaultValue={editingLecturer?.gender} options={["Male", "Female", "Other"]} />
                            <Input label="Date of Birth" name="dob" type="date" defaultValue={editingLecturer?.dob} />

                            <div className="col-span-2">
                                <ImageUpload
                                    label="Profile Photo"
                                    folder="lecturer_profiles"
                                    initialValue={editingLecturer?.photoUrl}
                                    onUpload={(url) => setUploadedPhotoUrl(url)}
                                />
                            </div>
                        </Section>

                        {/* Contact Info */}
                        <Section title="Contact Information">
                            <Input label="Official Email (Username)" name="email" type="email" defaultValue={editingLecturer?.email} required />
                            <Input label="Personal Email" name="personalEmail" type="email" defaultValue={editingLecturer?.personalEmail} />
                            <Input label="Mobile Number" name="mobile" defaultValue={editingLecturer?.mobile} />
                            <Input label="Office Phone" name="officePhone" defaultValue={editingLecturer?.officePhone} />
                            <Input label="Address" name="address" defaultValue={editingLecturer?.address} />
                            <Input label="City / District" name="city" defaultValue={editingLecturer?.city} />
                        </Section>

                        {/* Academic & Professional */}
                        <Section title="Academic & Professional Details">
                            <Input label="Designation" name="designation" defaultValue={editingLecturer?.designation} placeholder="e.g., Senior Lecturer" />
                            <Input label="Faculty / Department" name="faculty" defaultValue={editingLecturer?.faculty} />
                            <Input label="Campus" name="campus" defaultValue={editingLecturer?.campus} />
                            <Select label="Employment Type" name="employmentType" defaultValue={editingLecturer?.employmentType} options={["Full-time", "Part-time", "Visiting"]} />
                            <Input label="Qualifications" name="qualifications" defaultValue={editingLecturer?.qualifications} placeholder="e.g., MSc in IT" />
                            <Input label="Experience (Years)" name="experience" type="number" defaultValue={editingLecturer?.experience} />
                            <Input label="Date of Joining" name="dateOfJoining" type="date" defaultValue={editingLecturer?.dateOfJoining} />
                            <Input label="Reporting To" name="reportingTo" defaultValue={editingLecturer?.reportingTo} />
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Research Interests</label>
                                <input type="text" name="researchInterests" defaultValue={editingLecturer?.researchInterests} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Courses</label>
                                <div className="border border-gray-300 rounded-md p-4 max-h-60 overflow-y-auto bg-gray-50">
                                    {content.courses && content.courses.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {content.courses.map(course => (
                                                <label key={course.id} className="flex items-center space-x-2 p-2 hover:bg-white rounded cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCourses.includes(course.id)}
                                                        onChange={() => handleCourseToggle(course.id)}
                                                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                                    />
                                                    <span className="text-sm text-gray-700">{course.title}{course.courseCode ? ` (${course.courseCode})` : ""}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">No courses available. Please add courses first.</p>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Select the courses this lecturer is responsible for teaching.</p>
                            </div>
                        </Section>

                        {/* System Access */}
                        <Section title="System Access & Permissions">
                            {!editingLecturer && (
                                <Input
                                    label="Temporary Password"
                                    name="tempPassword"
                                    placeholder="User must reset on first login"
                                    note="Note: This does not auto-create the auth user yet."
                                />
                            )}
                            <Input label="Role" name="role" defaultValue={editingLecturer?.role || "Lecturer"} />
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Access Permissions</label>
                                <input type="text" name="permissions" defaultValue={editingLecturer?.permissions} placeholder="e.g., Manage courses, Upload materials" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                            <div className="flex items-center mt-6">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    defaultChecked={editingLecturer?.isActive ?? true}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-900">Active Account</label>
                            </div>
                        </Section>

                        {/* Optional / Support */}
                        <Section title="Optional / Support Fields">
                            <Input label="Office Location" name="officeLocation" defaultValue={editingLecturer?.officeLocation} />
                            <Input label="Emergency Contact" name="emergencyContact" defaultValue={editingLecturer?.emergencyContact} placeholder="Name & Number" />
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Teaching Timetable</label>
                                <textarea name="timetable" defaultValue={editingLecturer?.timetable} rows="2" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Notes / Remarks</label>
                                <textarea name="notes" defaultValue={editingLecturer?.notes} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                        </Section>

                        {/* Metadata Display (Read Only) */}
                        {editingLecturer && (
                            <div className="bg-gray-50 p-4 rounded-lg text-xs text-gray-500 space-y-1">
                                <p>Created By: {editingLecturer.createdBy}</p>
                                <p>Created Date: {editingLecturer.createdDate?.toDate?.().toLocaleDateString() || "N/A"}</p>
                                <p>Last Updated: {editingLecturer.lastUpdated?.toDate?.().toLocaleDateString() || "N/A"}</p>
                            </div>
                        )}

                        <div className="flex justify-end space-x-3 pt-6 border-t">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsFormOpen(false);
                                    setEditingLecturer(null);
                                    setUploadedPhotoUrl("");
                                    setSelectedCourses([]);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90"
                            >
                                Save Lecturer Profile
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

export default ManageLecturers;
