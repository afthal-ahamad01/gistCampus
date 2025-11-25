import { useState } from "react";
import { useContent } from "../../context/ContentContext";
import { db } from "../../config/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const ManageProgrammes = () => {
    const { content } = useContent();
    const [editingProgramme, setEditingProgramme] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            if (editingProgramme) {
                await updateDoc(doc(db, "programmes", editingProgramme.id), data);
            } else {
                await addDoc(collection(db, "programmes"), data);
            }
            setIsFormOpen(false);
            setEditingProgramme(null);
            alert("Programme saved successfully!");
        } catch (error) {
            console.error("Error saving programme:", error);
            alert("Failed to save programme.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this programme?")) {
            try {
                await deleteDoc(doc(db, "programmes", id));
                alert("Programme deleted successfully!");
            } catch (error) {
                console.error("Error deleting programme:", error);
                alert("Failed to delete programme.");
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Manage Programmes</h1>
                <button
                    onClick={() => {
                        setEditingProgramme(null);
                        setIsFormOpen(true);
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
                >
                    Add New Programme
                </button>
            </div>

            {!isFormOpen ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {content.programmes?.map((programme) => (
                            <li key={programme.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">{programme.name}</h3>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => {
                                            setEditingProgramme(programme);
                                            setIsFormOpen(true);
                                        }}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(programme.id)}
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
                        {editingProgramme ? "Edit Programme" : "Add New Programme"}
                    </h2>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Programme Name</label>
                            <input
                                type="text"
                                name="name"
                                defaultValue={editingProgramme?.name}
                                placeholder="e.g., Masters, Degree, HND, Diploma"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">This will appear on the homepage programmes section</p>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsFormOpen(false);
                                    setEditingProgramme(null);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90"
                            >
                                Save Programme
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ManageProgrammes;
