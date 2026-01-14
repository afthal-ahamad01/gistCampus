import { useState } from "react";
import { useContent } from "../../context/ContentContext";
import { db } from "../../config/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

import ImageUpload from "../../components/admin/ImageUpload";
import CustomAlert from "../../components/CustomAlert";

const ManageContent = () => {
    const { content } = useContent();
    const [activeTab, setActiveTab] = useState("newsEvents");
    const [editingItem, setEditingItem] = useState(null);
    const [uploadedCoverImage, setUploadedCoverImage] = useState("");
    const [uploadedImages, setUploadedImages] = useState([]);
    const [uploadedImage, setUploadedImage] = useState("");

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

    const tabs = [
        { id: "newsEvents", label: "News & Events" },
        { id: "heroSlides", label: "Hero Slides" },
        { id: "programmes", label: "Programmes" },
        { id: "testimonials", label: "Testimonials" },
        { id: "foreignAffiliations", label: "Foreign Affiliations" },
        { id: "professionalAffiliations", label: "Professional Affiliations" },
        { id: "stats", label: "Stats" },
        { id: "contactInfo", label: "Contact Info" },
        { id: "gallery", label: "Gallery (Life at GIST)" },
        { id: "certificates", label: "Issued Certificates" },
    ];

    // Reset upload states when opening modal or changing tabs
    const handleEdit = (item) => {
        setEditingItem(item);
        setUploadedCoverImage(item?.coverImage || "");
        setUploadedImages(Array.isArray(item?.images) ? item?.images : []);
        setUploadedImage(item?.image || "");
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            if (activeTab === "stats") {
                // Stats is a singleton
                const docId = data.id || "stats";
                delete data.id;

                const numericFields = ["years", "foreignPartnerships", "professionalPartnerships", "campuses", "lecturers", "students"];
                numericFields.forEach(field => {
                    if (data[field]) data[field] = Number(data[field]);
                });

                const { setDoc } = await import("firebase/firestore");
                await setDoc(doc(db, activeTab, docId), data, { merge: true });
            } else if (activeTab === "contactInfo") {
                // ContactInfo is part of siteMeta singleton
                const docId = "siteMeta";

                // Build contact object
                const contactData = {
                    contact: {
                        address: data.address || "",
                        hotline: data.hotline || "",
                        email: data.email || "",
                    },
                    social: [
                        { label: "Facebook", href: data.facebook || "" },
                        { label: "Instagram", href: data.instagram || "" },
                        { label: "LinkedIn", href: data.linkedin || "" },
                        { label: "YouTube", href: data.youtube || "" },
                        { label: "WhatsApp", href: data.whatsapp || "" },
                        { label: "TikTok", href: data.tiktok || "" },
                    ],
                };

                const { setDoc } = await import("firebase/firestore");
                await setDoc(doc(db, "siteMeta", docId), contactData, { merge: true });
            } else {
                if (activeTab === "newsEvents") {
                    data.coverImage = uploadedCoverImage;
                    data.images = uploadedImages;
                } else {
                    data.image = uploadedImage;
                }

                if (editingItem && editingItem.id) {
                    await updateDoc(doc(db, activeTab, editingItem.id), data);
                } else {
                    await addDoc(collection(db, activeTab), data);
                }
            }
            setEditingItem(null);
            showAlert("Success!", "Content saved successfully.", "success");
        } catch (error) {
            console.error("Error saving document:", error);
            showAlert("Error", "Failed to save content.", "error");
        }
    };

    const confirmDelete = async (id) => {
        try {
            await deleteDoc(doc(db, activeTab, id));
            showAlert("Deleted!", "Item deleted successfully.", "success");
        } catch (error) {
            console.error("Error deleting document:", error);
            showAlert("Error", "Failed to delete item.", "error");
        }
    };

    const handleDelete = async (id) => {
        showAlert(
            "Are you sure?",
            "Do you really want to delete this item?",
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
                <h1 className="text-3xl font-bold text-gray-900">Manage Content</h1>
                {activeTab !== "stats" && activeTab !== "contactInfo" && (
                    <button
                        onClick={() => handleEdit({})}
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
            ) : activeTab === "contactInfo" ? (
                <div className="bg-white shadow sm:rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Edit Contact Information</h2>
                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Contact Information Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Contact Details</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    defaultValue={content.siteMeta?.contact?.address}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                    placeholder="271/1, Osman Road, Sainthamaruthu 07"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Hotline</label>
                                <textarea
                                    name="hotline"
                                    rows={3}
                                    defaultValue={content.siteMeta?.contact?.hotline}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                    placeholder="070 300 8684&#10;076 300 8684&#10;072 300 8684"
                                />
                                <p className="mt-1 text-xs text-gray-500">Enter each phone number on a new line</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={content.siteMeta?.contact?.email}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                    placeholder="info@gistcampus.com"
                                />
                            </div>
                        </div>

                        {/* Social Media Links Section */}
                        <div className="space-y-4 border-t pt-6">
                            <h3 className="text-lg font-medium text-gray-900">Social Media Links</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Facebook URL</label>
                                    <input
                                        type="url"
                                        name="facebook"
                                        defaultValue={content.siteMeta?.social?.find(s => s.label === "Facebook")?.href}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                        placeholder="https://facebook.com/gistcampus"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Instagram URL</label>
                                    <input
                                        type="url"
                                        name="instagram"
                                        defaultValue={content.siteMeta?.social?.find(s => s.label === "Instagram")?.href}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                        placeholder="https://instagram.com/gistcampus"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                                    <input
                                        type="url"
                                        name="linkedin"
                                        defaultValue={content.siteMeta?.social?.find(s => s.label === "LinkedIn")?.href}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                        placeholder="https://linkedin.com/company/gistcampus"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">YouTube URL</label>
                                    <input
                                        type="url"
                                        name="youtube"
                                        defaultValue={content.siteMeta?.social?.find(s => s.label === "YouTube")?.href}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                        placeholder="https://youtube.com/@gistcampus"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">TikTok URL</label>
                                    <input
                                        type="url"
                                        name="tiktok"
                                        defaultValue={content.siteMeta?.social?.find(s => s.label === "TikTok")?.href}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                        placeholder="https://tiktok.com/@gistcampus"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
                                    <input
                                        type="url"
                                        name="whatsapp"
                                        defaultValue={content.siteMeta?.social?.find(s => s.label === "WhatsApp")?.href}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                        placeholder="https://wa.me/94703008684"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Format: https://wa.me/94XXXXXXXXX</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90"
                            >
                                Save Contact Info
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
                                            onClick={() => handleEdit(item)}
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
                        {/* Title input handled conditionally below for gallery/certs */}

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
                                <ImageUpload
                                    label="Cover Image"
                                    folder="news_covers"
                                    initialValue={editingItem.coverImage}
                                    onUpload={(url) => setUploadedCoverImage(url)}
                                />
                                {/* For simplicity for now, just main URL. Gallery can be complex */}
                                {/* In a full app you might loop ImageUpload for gallery */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <ImageUpload
                                            label="Image 1"
                                            folder="news_gallery"
                                            initialValue={editingItem.images?.[0]}
                                            onUpload={(url) => {
                                                const newImages = [...uploadedImages];
                                                newImages[0] = url;
                                                setUploadedImages(newImages);
                                            }}
                                        />
                                        <ImageUpload
                                            label="Image 2"
                                            folder="news_gallery"
                                            initialValue={editingItem.images?.[1]}
                                            onUpload={(url) => {
                                                const newImages = [...uploadedImages];
                                                newImages[1] = url;
                                                setUploadedImages(newImages);
                                            }}
                                        />
                                    </div>
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

                        {activeTab === "certificates" && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Certificate Number</label>
                                    <input
                                        type="text"
                                        name="certificateNo"
                                        defaultValue={editingItem.certificateNo}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                        required
                                        placeholder="e.g. GIST-2025-001"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Student Name</label>
                                    <input
                                        type="text"
                                        name="studentName"
                                        defaultValue={editingItem.studentName}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Programme Name</label>
                                    <input
                                        type="text"
                                        name="programme"
                                        defaultValue={editingItem.programme}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Completion Year</label>
                                    <input
                                        type="number"
                                        name="year"
                                        defaultValue={editingItem.year || new Date().getFullYear()}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                        required
                                    />
                                </div>
                            </div>
                        )}




                        {activeTab === "gallery" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Caption</label>
                                <input
                                    type="text"
                                    name="caption"
                                    defaultValue={editingItem.caption}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                    required
                                />
                            </div>
                        )}

                        {activeTab !== "programmes" && activeTab !== "gallery" && activeTab !== "certificates" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {activeTab === "testimonials" ? "Name" : "Title / Name"}
                                    </label>
                                    <input
                                        type="text"
                                        name={activeTab === "testimonials" ? "name" : "title"}
                                        defaultValue={editingItem.title || editingItem.name}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                        required
                                    />
                                </div>
                            </>
                        )}


                        {activeTab !== "programmes" && activeTab !== "certificates" && (
                            <>
                                {activeTab !== "gallery" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            {activeTab === "testimonials" ? "Role" : "Description"}
                                        </label>
                                        <textarea
                                            name={activeTab === "testimonials" ? "role" : "description"}
                                            defaultValue={editingItem.description || editingItem.role}
                                            rows={3}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm form-input"
                                        />
                                    </div>
                                )}

                                {activeTab !== "newsEvents" && (
                                    <ImageUpload
                                        label="Image"
                                        folder={activeTab} // e.g., foreignAffiliations, testimonials, gallery
                                        initialValue={editingItem.image}
                                        onUpload={(url) => setUploadedImage(url)}
                                    />
                                )}
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
                </div >
            )}
        </div >
    );
};

export default ManageContent;
