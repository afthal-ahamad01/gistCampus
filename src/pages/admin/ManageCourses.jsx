import { useState } from "react";
import { useContent } from "../../context/ContentContext";
import { db } from "../../config/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import ImageUpload from "../../components/admin/ImageUpload";
import CustomAlert from "../../components/CustomAlert";

const ManageCourses = () => {
    const { content } = useContent();
    const [editingCourse, setEditingCourse] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [uploadedHeroImage, setUploadedHeroImage] = useState("");

    // Alert State
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: "",
        message: "",
        type: "success",
        onConfirm: null
    });

    console.log("Rendering ManageCourses");

    const showAlert = (title, message, type = "success", onConfirm = null) => {
        setAlertConfig({ isOpen: true, title, message, type, onConfirm });
    };

    const closeAlert = () => {
        setAlertConfig(prev => ({ ...prev, isOpen: false }));
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setUploadedHeroImage(course?.heroImage || "");
        setIsFormOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        data.heroImage = uploadedHeroImage;

        // Generate slug from title if not present or just auto-generate
        if (!data.slug) {
            data.slug = data.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
        }

        // Process arrays
        if (data.modules) {
            data.modules = data.modules.split(",").map(item => item.trim()).filter(item => item !== "");
        }
        if (data.entryRequirements) {
            data.entryRequirements = data.entryRequirements.split(",").map(item => item.trim()).filter(item => item !== "");
        }

        try {
            if (editingCourse) {
                await updateDoc(doc(db, "courses", editingCourse.id), data);
            } else {
                await addDoc(collection(db, "courses"), data);
            }
            setIsFormOpen(false);
            setEditingCourse(null);
            showAlert("Success!", "Course saved successfully.", "success");
        } catch (error) {
            console.error("Error saving course:", error);
            showAlert("Error", "Failed to save course. Please try again.", "error");
        }
    };

    const confirmDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "courses", id));
            showAlert("Deleted!", "Course deleted successfully.", "success");
        } catch (error) {
            console.error("Error deleting course:", error);
            showAlert("Error", "Failed to delete course.", "error");
        }
    };

    const handleDelete = (id) => {
        showAlert(
            "Are you sure?",
            "Do you really want to delete this course? This process cannot be undone.",
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
                <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
                <button
                    onClick={() => handleEdit(null)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
                >
                    Add New Course
                </button>
            </div>

            {!isFormOpen ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {/* Group courses by Programme */}
                        {content.programmes?.map((programme) => {
                            const programCourses = content.courses.filter(c => c.programTypeId === programme.id);
                            if (programCourses.length === 0) return null;

                            return (
                                <div key={programme.id} className="border-b border-gray-200 last:border-b-0">
                                    <h3 className="bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        {programme.name || programme.label}
                                    </h3>
                                    <ul className="divide-y divide-gray-200">
                                        {programCourses.map((course) => (
                                            <li key={course.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                                <div>
                                                    <h4 className="text-lg font-medium text-gray-900">{course.title}</h4>
                                                    <p className="text-sm text-gray-500">
                                                        {course.duration} | {course.level || "No Level"}
                                                    </p>
                                                </div>
                                                <div className="flex space-x-3">
                                                    <button
                                                        onClick={() => handleEdit(course)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(course.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}

                        {/* Uncategorized Courses */}
                        {(() => {
                            const uncategorizedCourses = content.courses.filter(c => !content.programmes?.some(p => p.id === c.programTypeId));
                            if (uncategorizedCourses.length === 0) return null;

                            return (
                                <div className="border-b border-gray-200 last:border-b-0">
                                    <h3 className="bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Uncategorized / Archived
                                    </h3>
                                    <ul className="divide-y divide-gray-200">
                                        {uncategorizedCourses.map((course) => (
                                            <li key={course.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                                <div>
                                                    <h4 className="text-lg font-medium text-gray-900">{course.title}</h4>
                                                    <p className="text-sm text-gray-500">
                                                        {course.duration}
                                                    </p>
                                                </div>
                                                <div className="flex space-x-3">
                                                    <button
                                                        onClick={() => handleEdit(course)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(course.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })()}
                    </ul>
                </div>
            ) : (
                <div className="bg-white shadow sm:rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingCourse ? "Edit Course" : "Add New Course"}
                    </h2>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Course Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    defaultValue={editingCourse?.title}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Program Type</label>
                                <select
                                    name="programTypeId"
                                    defaultValue={editingCourse?.programTypeId}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                    required
                                >
                                    <option value="">Select Program Type</option>
                                    {content.programmes?.map(p => (
                                        <option key={p.id} value={p.id}>{p.name || p.label}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Faculty selection removed as per client request to replace Faculties with Programmes */}
                            {/* 
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Faculty (Optional)</label>
                                <select
                                    name="facultyId"
                                    defaultValue={editingCourse?.facultyId}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                >
                                    <option value="">Select Faculty</option>
                                    {content.faculties.map(f => (
                                        <option key={f.id} value={f.id}>{f.title}</option>
                                    ))}
                                </select>
                            </div>
                            */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Duration</label>
                                <input
                                    type="text"
                                    name="duration"
                                    defaultValue={editingCourse?.duration}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Level (Display Label)</label>
                                <input
                                    type="text"
                                    name="level"
                                    defaultValue={editingCourse?.level}
                                    placeholder="e.g. Masters, Degree, HND"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fees</label>
                                <input
                                    type="text"
                                    name="fees"
                                    defaultValue={editingCourse?.fees}
                                    placeholder="e.g. LKR 500,000"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <ImageUpload
                                    label="Course Hero Image"
                                    folder="course_heroes"
                                    initialValue={editingCourse?.heroImage}
                                    onUpload={(url) => setUploadedHeroImage(url)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                defaultValue={editingCourse?.description}
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Course Pathway (Optional)</label>
                            <textarea
                                name="pathway"
                                defaultValue={editingCourse?.pathway}
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                placeholder="Describe the career or academic pathway for this course..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Modules (Comma separated)</label>
                                <textarea
                                    name="modules"
                                    defaultValue={Array.isArray(editingCourse?.modules) ? editingCourse.modules.join(", ") : editingCourse?.modules}
                                    rows={4}
                                    placeholder="Module 1, Module 2, Module 3"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                />
                                <p className="text-xs text-gray-500 mt-1">Separate modules with commas.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Entry Requirements (Comma separated)</label>
                                <textarea
                                    name="entryRequirements"
                                    defaultValue={Array.isArray(editingCourse?.entryRequirements) ? editingCourse.entryRequirements.join(", ") : editingCourse?.entryRequirements}
                                    rows={4}
                                    placeholder="3 Passes in A/L, Credit in English"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                />
                                <p className="text-xs text-gray-500 mt-1">Separate requirements with commas.</p>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsFormOpen(false);
                                    setEditingCourse(null);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90"
                            >
                                Save Course
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ManageCourses;
