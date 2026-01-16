import { useState, useEffect } from "react";
import { db, storage } from "../../config/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import CustomAlert from "../../components/CustomAlert";

const ManageTranscripts = () => {
    const [transcripts, setTranscripts] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: "",
        message: "",
        type: "success",
        onConfirm: null
    });

    // Form State
    const [activeRequestId, setActiveRequestId] = useState(null);
    const [studentId, setStudentId] = useState("");
    const [studentName, setStudentName] = useState("");
    const [studentEmail, setStudentEmail] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [transcriptsSnap, requestsSnap] = await Promise.all([
                getDocs(collection(db, "transcripts")),
                getDocs(collection(db, "transcriptRequests"))
            ]);

            setTranscripts(transcriptsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setRequests(requestsSnap.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(req => req.status !== 'completed' && req.status !== 'rejected')
                .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
            );
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFulfill = (request) => {
        setActiveRequestId(request.id);
        setStudentId(request.studentId || "");
        setStudentName(request.fullName || "");
        setStudentEmail(request.email || ""); // Capture email from request
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleReject = async (requestId) => {
        setAlertConfig({
            isOpen: true,
            title: "Reject Request?",
            message: "Are you sure you want to reject this transcript request? This action cannot be undone.",
            type: "confirm",
            onConfirm: async () => {
                try {
                    const { updateDoc } = await import("firebase/firestore");
                    await updateDoc(doc(db, "transcriptRequests", requestId), {
                        status: 'rejected',
                        rejectedAt: new Date().toISOString()
                    });
                    fetchData();
                    setAlertConfig({
                        isOpen: true,
                        title: "Request Rejected",
                        message: "The transcript request has been successfully rejected.",
                        type: "success"
                    });
                } catch (error) {
                    console.error("Error rejecting request:", error);
                    setAlertConfig({
                        isOpen: true,
                        title: "Error",
                        message: "Failed to reject the request. Please try again.",
                        type: "error"
                    });
                }
            }
        });
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const file = e.target.file.files[0];
        if (!file || !studentId || !studentName) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `transcripts/${studentId}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);

            // 1. Add to Transcripts Collection
            await addDoc(collection(db, "transcripts"), {
                studentId,
                studentName,
                studentEmail, // Save email
                fileName: file.name,
                url,
                uploadedAt: new Date().toISOString(),
                storagePath: `transcripts/${studentId}_${file.name}`
            });

            // 2. If fulfilling a request, mark it completed
            if (activeRequestId) {
                const { updateDoc } = await import("firebase/firestore");
                await updateDoc(doc(db, "transcriptRequests", activeRequestId), {
                    status: 'completed',
                    completedAt: new Date().toISOString(),
                    transcriptUrl: url
                });
            }

            // Reset Form
            setStudentId("");
            setStudentName("");
            setActiveRequestId(null);
            e.target.reset();

            fetchData();
            setAlertConfig({
                isOpen: true,
                title: "Transcript Uploaded",
                message: "The transcript has been uploaded and the student has been notified.",
                type: "success"
            });
        } catch (error) {
            console.error("Error uploading transcript:", error);
            setAlertConfig({
                isOpen: true,
                title: "Upload Failed",
                message: `Failed to upload transcript: ${error.message}`,
                type: "error"
            });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (transcript) => {
        setAlertConfig({
            isOpen: true,
            title: "Delete Transcript?",
            message: "Are you sure you want to permanently delete this transcript?",
            type: "confirm",
            onConfirm: async () => {
                try {
                    if (transcript.storagePath) {
                        const storageRef = ref(storage, transcript.storagePath);
                        await deleteObject(storageRef);
                    }
                    await deleteDoc(doc(db, "transcripts", transcript.id));
                    fetchData();
                    setAlertConfig({
                        isOpen: true,
                        title: "Deleted",
                        message: "Transcript has been deleted successfully.",
                        type: "success"
                    });
                } catch (error) {
                    console.error("Error deleting transcript:", error);
                    setAlertConfig({
                        isOpen: true,
                        title: "Error",
                        message: "Failed to delete transcript.",
                        type: "error"
                    });
                }
            }
        });
    };

    const filteredTranscripts = transcripts.filter(t =>
        t.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Manage Transcripts</h1>

            {/* Upload Section */}
            <div className="bg-white shadow sm:rounded-lg p-6 border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    {activeRequestId ? "Fulfilling Request" : "Upload New Transcript"}
                    {activeRequestId && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Request ID: {activeRequestId}
                        </span>
                    )}
                </h2>
                <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Student ID</label>
                        <input
                            type="text"
                            name="studentId"
                            className="form-input w-full"
                            required
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Student Name</label>
                        <input
                            type="text"
                            name="studentName"
                            className="form-input w-full"
                            required
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">PDF File</label>
                        <input type="file" name="file" accept=".pdf" className="form-input w-full" required />
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={uploading}
                            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                        >
                            {uploading ? "Uploading..." : "Upload"}
                        </button>
                        {activeRequestId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setActiveRequestId(null);
                                    setStudentId("");
                                    setStudentName("");
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Pending Requests */}
            {requests.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-yellow-800 mb-4">Pending Transcript Requests ({requests.length})</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {requests.map(req => (
                            <div key={req.id} className="bg-white p-4 rounded-lg shadow-sm border border-yellow-100">
                                <p className="font-bold text-gray-900">{req.fullName}</p>
                                <p className="text-sm text-gray-600">ID: {req.studentId}</p>
                                <p className="text-sm text-gray-600">Prog: {req.programmeName}</p>
                                <p className="text-sm text-gray-500 mt-2 italic">"{req.purpose}"</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleFulfill(req)}
                                        className="mt-3 flex-1 py-2 bg-yellow-100 text-yellow-800 font-medium rounded hover:bg-yellow-200 transition-colors text-sm"
                                    >
                                        Fulfill
                                    </button>
                                    <button
                                        onClick={() => handleReject(req.id)}
                                        className="mt-3 flex-1 py-2 bg-red-50 text-red-700 font-medium rounded hover:bg-red-100 transition-colors text-sm"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="border-t border-gray-200 my-8"></div>

            {/* Search & List */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Uploaded Transcripts</h2>
                    <input
                        type="text"
                        placeholder="Search transcripts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input w-full md:w-1/3"
                    />
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    {loading ? <p className="p-6 text-center">Loading...</p> : (
                        <ul className="divide-y divide-gray-200">
                            {filteredTranscripts.map((transcript) => (
                                <li key={transcript.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">{transcript.studentName}</h3>
                                        <p className="text-sm text-gray-500">{transcript.studentId} • {transcript.fileName}</p>
                                    </div>
                                    <div className="flex space-x-3 text-sm">
                                        <a
                                            href={transcript.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 hover:text-indigo-900 font-medium"
                                        >
                                            View
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

            <CustomAlert
                isOpen={alertConfig.isOpen}
                onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
                onConfirm={alertConfig.onConfirm}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
            />
        </div>
    );
};

export default ManageTranscripts;

