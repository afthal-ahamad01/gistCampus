import { useState, useEffect } from "react";
import { db, firebaseConfig } from "../../config/firebase";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, serverTimestamp, setDoc as apiSetDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthProvider";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const ManageLecturers = () => {
    const { currentUser } = useAuth();
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingLecturer, setEditingLecturer] = useState(null);

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

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        // Boolean conversions
        data.isActive = data.isActive === "on";

        // Metadata updates
        const timestamp = serverTimestamp();
        data.lastUpdated = timestamp;

        let newUserId = null;

        try {
            if (!editingLecturer) {
                // CREATE NEW LECTURER
                data.createdDate = timestamp;
                data.createdBy = currentUser?.email || "admin";
                data.role = "lecturer";

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
                    alert("Temporary Password is required for new lecturers.");
                    return;
                }

                // 2. Create Firestore Document with same UID
                if (newUserId) {
                    await apiSetDoc(doc(db, "lecturers", newUserId), data);
                } else {
                    // Fallback
                    await addDoc(collection(db, "lecturers"), data);
                }

            } else {
                // UPDATE EXISTING LECTURER
                delete data.tempPassword; // Don't save password to DB
                await updateDoc(doc(db, "lecturers", editingLecturer.id), data);
            }

            setIsFormOpen(false);
            setEditingLecturer(null);
            fetchLecturers();
            alert("Lecturer saved successfully!");
        } catch (error) {
            console.error("Error saving lecturer:", error);
            alert("Failed to save lecturer.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this lecturer?")) {
            try {
                await deleteDoc(doc(db, "lecturers", id));
                fetchLecturers();
            } catch (error) {
                console.error("Error deleting lecturer:", error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Lecturer Management</h1>
                <button
                    onClick={() => {
                        setEditingLecturer(null);
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
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${lecturer.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {lecturer.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => {
                                                        setEditingLecturer(lecturer);
                                                        setIsFormOpen(true);
                                                    }}
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
                            <Input label="Profile Photo URL" name="photoUrl" defaultValue={editingLecturer?.photoUrl} placeholder="https://..." />
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
                                <label className="block text-sm font-medium text-gray-700">Courses Assigned</label>
                                <input type="text" name="coursesAssigned" defaultValue={editingLecturer?.coursesAssigned} placeholder="Comma separated modules" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
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
