import { useState } from "react";
import { useContent } from "../../context/ContentContext";
import { db } from "../../config/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const ManageContent = () => {
    const { content } = useContent();
    const [activeTab, setActiveTab] = useState("newsEvents");
    const [editingItem, setEditingItem] = useState(null);

    const tabs = [
        { id: "newsEvents", label: "News & Events" },
        { id: "heroSlides", label: "Hero Slides" },
        { id: "programmes", label: "Programmes" },
        { id: "testimonials", label: "Testimonials" },
        { id: "foreignAffiliations", label: "Foreign Affiliations" },
        { id: "professionalAffiliations", label: "Professional Affiliations" },
        { id: "stats", label: "Stats" },
    ];

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            if (activeTab === "stats") {
                // Stats is a singleton, so we always update the same document
                // We assume the ID is 'stats' or passed in the form
                const docId = data.id || "stats";
                // Remove id from data to avoid overwriting it in the doc content if not needed, 
                // though setDoc/updateDoc handles it fine.
                delete data.id;

                // Convert string numbers back to numbers
                const numericFields = ["years", "foreignPartnerships", "professionalPartnerships", "campuses", "lecturers", "students"];
                numericFields.forEach(field => {
                    if (data[field]) data[field] = Number(data[field]);
                });

                // Handle News Images Array
                if (activeTab === "newsEvents" && data.images) {
                    if (typeof data.images === "string") {
                        // Split by comma, trim whitespace, and filter out empty strings
                        data.images = data.images.split(",").map(url => url.trim()).filter(url => url.length > 0);
                    }
                } else if (activeTab === "newsEvents" && !data.images) {
                    // If images field is empty, ensure it's an empty array or null, not undefined
                    data.images = [];
                }

                // Use setDoc with merge: true to ensure it exists or updates
                const { setDoc } = await import("firebase/firestore");
                await setDoc(doc(db, activeTab, docId), data, { merge: true });
            } else if (editingItem) {
                await updateDoc(doc(db, activeTab, editingItem.id), data);
            } else {
                await addDoc(collection(db, activeTab), data);
            }
            setEditingItem(null);
            // Ideally, we should trigger a refresh of the content context or it should listen to real-time updates
            // For now, we rely on the context's initial load or manual refresh, but Firestore listeners would be better.
            alert("Saved successfully!");
        } catch (error) {
            console.error("Error saving document:", error);
            alert("Failed to save.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await deleteDoc(doc(db, activeTab, id));
                alert("Deleted successfully!");
            } catch (error) {
                console.error("Error deleting document:", error);
                alert("Failed to delete.");
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Manage Content</h1>
                {activeTab !== "stats" && (
                    <button
                        onClick={() => setEditingItem({})}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
                    >
                        Add New
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setEditingItem(null);
                            }}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                ? "border-primary text-primary"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content List or Singleton Form */}
            {activeTab === "stats" ? (
                <div className="bg-white shadow sm:rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Edit Stats</h2>
                    <form onSubmit={handleSave} className="space-y-4">
                        {/* We assume the stats object has an ID, if not we might need to handle it */}
                        <input type="hidden" name="id" value={content.stats?.id || "stats"} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Years of Excellence</label>
                                <input
                                    type="number"
                                    name="years"
                                    defaultValue={content.stats?.years}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Foreign Partnerships</label>
                                <input
                                    type="number"
                                    name="foreignPartnerships"
                                    defaultValue={content.stats?.foreignPartnerships}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Professional Partnerships</label>
                                <input
                                    type="number"
                                    name="professionalPartnerships"
                                    defaultValue={content.stats?.professionalPartnerships}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Campuses</label>
                                <input
                                    type="number"
                                    name="campuses"
                                    defaultValue={content.stats?.campuses}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Qualified Lecturers</label>
                                <input
                                    type="number"
                                    name="lecturers"
                                    defaultValue={content.stats?.lecturers}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Student Population</label>
                                <input
                                    type="number"
                                    name="students"
                                    defaultValue={content.stats?.students}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90"
                            >
                                Save Stats
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                !editingItem && (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {content[activeTab]?.map((item) => (
                                <li key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {item.title || item.name || "Untitled Item"}
                                        </h3>
                                        <p className="text-sm text-gray-500 truncate max-w-md">
                                            {item.description || item.role || item.date}
                                        </p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => setEditingItem(item)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                            {(!content[activeTab] || content[activeTab].length === 0) && (
                                <li className="px-6 py-4 text-center text-gray-500">No items found.</li>
                            )}
                        </ul>
                    </div>
                )
            )}

            {/* Edit Form */}
            {editingItem && (
                <div className="bg-white shadow sm:rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingItem.id ? "Edit Item" : "Add New Item"}
                    </h2>
                    <form onSubmit={handleSave} className="space-y-4">
                        {/* Dynamic fields based on tab would be better, but for MVP generic inputs */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                {activeTab === "programmes" ? "Programme Name" : "Title / Name"}
                            </label>
                            <input
                                type="text"
                                name={activeTab === "testimonials" || activeTab === "programmes" ? "name" : "title"}
                                defaultValue={editingItem.title || editingItem.name}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                required
                            />
                        </div>

                        {activeTab === "newsEvents" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        defaultValue={editingItem.date}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cover Image URL</label>
                                    <input
                                        type="text"
                                        name="coverImage"
                                        defaultValue={editingItem.coverImage}
                                        placeholder="https://..."
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Gallery Images (Comma separated URLs)</label>
                                    <textarea
                                        name="images"
                                        defaultValue={Array.isArray(editingItem.images) ? editingItem.images.join(", ") : editingItem.images}
                                        placeholder="https://image1.jpg, https://image2.jpg"
                                        rows={2}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Enter multiple image URLs separated by commas for the slider.</p>
                                </div>
                            </>
                        )}

                        {activeTab === "foreignAffiliations" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    defaultValue={editingItem.country}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                />
                            </div>
                        )}


                        {activeTab !== "programmes" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Description / Role / Caption
                                    </label>
                                    <textarea
                                        name={activeTab === "testimonials" ? "role" : "description"}
                                        defaultValue={editingItem.description || editingItem.role}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                    />
                                </div>

                                {/* Image URL field - in a real app this would be a file upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                    <input
                                        type="text"
                                        name="image"
                                        defaultValue={editingItem.image}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setEditingItem(null)}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ManageContent;
