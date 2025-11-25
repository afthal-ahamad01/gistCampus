import { useState } from "react";
import { useContent } from "../../context/ContentContext";
import { db } from "../../config/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const ManageCourses = () => {
    const { content } = useContent();
    const [editingCourse, setEditingCourse] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

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
            alert("Course saved successfully!");
        } catch (error) {
            console.error("Error saving course:", error);
            alert("Failed to save course.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            try {
                await deleteDoc(doc(db, "courses", id));
                alert("Course deleted successfully!");
            } catch (error) {
                console.error("Error deleting course:", error);
                alert("Failed to delete course.");
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
                <button
                    onClick={() => {
                        setEditingCourse(null);
                        setIsFormOpen(true);
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
                >
                    Add New Course
                </button>
            </div>

            {!isFormOpen ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {content.courses.map((course) => (
                            <li key={course.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                                    <p className="text-sm text-gray-500">{course.facultyId} | {course.duration}</p>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => {
                                            setEditingCourse(course);
                                            setIsFormOpen(true);
                                        }}
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
                                <label className="block text-sm font-medium text-gray-700">Faculty</label>
                                <select
                                    name="facultyId"
                                    defaultValue={editingCourse?.facultyId}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                    required
                                >
                                    <option value="">Select Faculty</option>
                                    {content.faculties.map(f => (
                                        <option key={f.id} value={f.id}>{f.title}</option>
                                    ))}
                                </select>
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
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Course Image URL</label>
                                <input
                                    type="text"
                                    name="heroImage"
                                    defaultValue={editingCourse?.heroImage}
                                    placeholder="https://example.com/image.jpg"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
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
