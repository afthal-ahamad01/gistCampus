import { useState, useEffect } from "react";
import { db, storage } from "../../config/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const ManageTranscripts = () => {
    const [transcripts, setTranscripts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchTranscripts();
    }, []);

    const fetchTranscripts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "transcripts"));
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTranscripts(data);
        } catch (error) {
            console.error("Error fetching transcripts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const file = e.target.file.files[0];
        const studentId = e.target.studentId.value;
        const studentName = e.target.studentName.value;

        if (!file) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `transcripts/${studentId}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);

            await addDoc(collection(db, "transcripts"), {
                studentId,
                studentName,
                fileName: file.name,
                url,
                uploadedAt: new Date().toISOString(),
                storagePath: `transcripts/${studentId}_${file.name}`
            });

            e.target.reset();
            fetchTranscripts();
            alert("Transcript uploaded successfully!");
        } catch (error) {
            console.error("Error uploading transcript:", error);
            alert("Failed to upload transcript.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (transcript) => {
        if (window.confirm("Are you sure you want to delete this transcript?")) {
            try {
                // Delete from Storage
                if (transcript.storagePath) {
                    const storageRef = ref(storage, transcript.storagePath);
                    await deleteObject(storageRef);
                }

                // Delete from Firestore
                await deleteDoc(doc(db, "transcripts", transcript.id));
                fetchTranscripts();
            } catch (error) {
                console.error("Error deleting transcript:", error);
                alert("Failed to delete transcript.");
            }
        }
    };

    const filteredTranscripts = transcripts.filter(t =>
        t.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Manage Transcripts</h1>

            {/* Upload Form */}
            <div className="bg-white shadow sm:rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Upload New Transcript</h2>
                <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Student ID</label>
                        <input type="text" name="studentId" className="form-input w-full" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Student Name</label>
                        <input type="text" name="studentName" className="form-input w-full" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">PDF File</label>
                        <input type="file" name="file" accept=".pdf" className="form-input w-full" required />
                    </div>
                    <button
                        type="submit"
                        disabled={uploading}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                    >
                        {uploading ? "Uploading..." : "Upload"}
                    </button>
                </form>
            </div>

            {/* Search */}
            <div>
                <input
                    type="text"
                    placeholder="Search by Student ID or Name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input w-full md:w-1/3"
                />
            </div>

            {/* List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                {loading ? <p className="p-6 text-center">Loading...</p> : (
                    <ul className="divide-y divide-gray-200">
                        {filteredTranscripts.map((transcript) => (
                            <li key={transcript.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">{transcript.studentName} ({transcript.studentId})</h3>
                                    <p className="text-sm text-gray-500">{transcript.fileName} • Uploaded: {new Date(transcript.uploadedAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex space-x-3">
                                    <a
                                        href={transcript.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        View/Download
                                    </a>
                                    <button
                                        onClick={() => handleDelete(transcript)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                        {filteredTranscripts.length === 0 && (
                            <li className="px-6 py-4 text-center text-gray-500">No transcripts found.</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ManageTranscripts;
