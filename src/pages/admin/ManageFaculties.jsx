import { useState } from "react";
import { useContent } from "../../context/ContentContext";
import { db } from "../../config/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const ManageFaculties = () => {
    const { content } = useContent();
    const [editingFaculty, setEditingFaculty] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            if (editingFaculty) {
                await updateDoc(doc(db, "faculties", editingFaculty.id), data);
            } else {
                await addDoc(collection(db, "faculties"), data);
            }
            setIsFormOpen(false);
            setEditingFaculty(null);
            alert("Faculty saved successfully!");
        } catch (error) {
            console.error("Error saving faculty:", error);
            alert("Failed to save faculty.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this faculty?")) {
            try {
                await deleteDoc(doc(db, "faculties", id));
                alert("Faculty deleted successfully!");
            } catch (error) {
                console.error("Error deleting faculty:", error);
                alert("Failed to delete faculty.");
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Manage Faculties</h1>
                <button
                    onClick={() => {
                        setEditingFaculty(null);
                        setIsFormOpen(true);
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
                >
                    Add New Faculty
                </button>
            </div>

            {!isFormOpen ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {content.faculties?.map((faculty) => (
                            <li key={faculty.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">{faculty.title}</h3>
                                    <p className="text-sm text-gray-500 truncate max-w-md">{faculty.excerpt}</p>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => {
                                            setEditingFaculty(faculty);
                                            setIsFormOpen(true);
                                        }}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(faculty.id)}
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
                        {editingFaculty ? "Edit Faculty" : "Add New Faculty"}
                    </h2>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Faculty Title</label>
                            <input
                                type="text"
                                name="title"
                                defaultValue={editingFaculty?.title}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Excerpt</label>
                            <textarea
                                name="excerpt"
                                defaultValue={editingFaculty?.excerpt}
                                rows={2}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                defaultValue={editingFaculty?.description}
                                rows={4}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Hero Image URL</label>
                            <input
                                type="text"
                                name="heroImage"
                                defaultValue={editingFaculty?.heroImage}
                                placeholder="https://..."
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                required
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsFormOpen(false);
                                    setEditingFaculty(null);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90"
                            >
                                Save Faculty
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ManageFaculties;
