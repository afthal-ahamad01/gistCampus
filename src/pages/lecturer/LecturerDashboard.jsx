import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useContent } from "../../context/ContentContext";
import { db } from "../../config/firebase";
import { doc, getDoc, collection, addDoc, query, where, getDocs, deleteDoc, serverTimestamp } from "firebase/firestore";
import FileUpload from "../../components/FileUpload";

const LecturerDashboard = () => {
    const { currentUser } = useAuth();
    const { content } = useContent();
    const [lecturerData, setLecturerData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Upload & Course State
    const [assignedCourses, setAssignedCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // Form State
    const [materialTitle, setMaterialTitle] = useState("");
    const [materialDesc, setMaterialDesc] = useState("");
    const [fileData, setFileData] = useState({ url: "", name: "" });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchLecturerData = async () => {
            if (currentUser?.uid) {
                try {
                    const docRef = doc(db, "lecturers", currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setLecturerData(data);

                        // Process Assigned Courses
                        if (data.coursesAssigned) {
                            let courseIds = [];
                            if (Array.isArray(data.coursesAssigned)) {
                                courseIds = data.coursesAssigned;
                            } else if (typeof data.coursesAssigned === "string") {
                                // Legacy support or if stored as string
                                courseIds = data.coursesAssigned.split(",").map(s => s.trim());
                            }

                            // Map IDs to Course Objects from ContentContext
                            const courses = content.courses.filter(c => courseIds.includes(c.id));
                            setAssignedCourses(courses);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching lecturer data:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchLecturerData();
    }, [currentUser, content.courses]);

    // Fetch uploads when course is selected
    useEffect(() => {
        if (selectedCourseId) {
            fetchCourseMaterials(selectedCourseId);
        } else {
            setUploadedFiles([]);
        }
    }, [selectedCourseId]);

    const fetchCourseMaterials = async (courseId) => {
        try {
            const q = query(
                collection(db, "course_contents"),
                where("courseId", "==", courseId),
                where("lecturerId", "==", currentUser.uid)
            );
            const querySnapshot = await getDocs(q);
            const files = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Sort by date desc
            files.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
            setUploadedFiles(files);
        } catch (error) {
            console.error("Error fetching materials:", error);
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!selectedCourseId || !fileData.url || !materialTitle) {
            alert("Please fill all fields and upload a file.");
            return;
        }

        setUploading(true);
        try {
            await addDoc(collection(db, "course_contents"), {
                courseId: selectedCourseId,
                lecturerId: currentUser.uid,
                lecturerName: lecturerData?.fullName || "Lecturer",
                title: materialTitle,
                description: materialDesc,
                fileUrl: fileData.url,
                fileName: fileData.name, // Saved from FileUpload callback
                createdAt: serverTimestamp()
            });

            alert("Material uploaded successfully!");
            // Reset form
            setMaterialTitle("");
            setMaterialDesc("");
            setFileData({ url: "", name: "" });
            // Refresh list
            fetchCourseMaterials(selectedCourseId);
        } catch (error) {
            console.error("Error uploading material:", error);
            alert("Failed to upload material.");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteMaterial = async (id) => {
        if (window.confirm("Are you sure you want to delete this material?")) {
            try {
                await deleteDoc(doc(db, "course_contents", id));
                setUploadedFiles(prev => prev.filter(f => f.id !== id));
            } catch (error) {
                console.error("Error deleting material:", error);
            }
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {lecturerData?.fullName || "Lecturer"}! 👋
                </h1>
                <p className="text-gray-500 mt-1">Manage your course materials and students.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Course List & Upload Form */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Upload Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Course Material</h2>

                        <form onSubmit={handleFileUpload} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
                                <select
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring-primary"
                                    value={selectedCourseId}
                                    onChange={(e) => setSelectedCourseId(e.target.value)}
                                    required
                                >
                                    <option value="">-- Choose a Course --</option>
                                    {assignedCourses.map(course => (
                                        <option key={course.id} value={course.id}>
                                            {course.title}{course.courseCode ? ` (${course.courseCode})` : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedCourseId && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                        <input
                                            type="text"
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring-primary"
                                            value={materialTitle}
                                            onChange={(e) => setMaterialTitle(e.target.value)}
                                            placeholder="e.g., Week 1 Lecture Slides"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                        <textarea
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring-primary"
                                            rows="2"
                                            value={materialDesc}
                                            onChange={(e) => setMaterialDesc(e.target.value)}
                                            placeholder="Brief text about this file..."
                                        />
                                    </div>
                                    <div>
                                        <FileUpload
                                            label="Attach File (PDF, Doc, PPT)"
                                            folder="course_materials"
                                            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                                            onUpload={(url, name) => setFileData({ url, name })}
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={uploading || !fileData.url}
                                            className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                                        >
                                            {uploading ? "Uploading..." : "Publish Material"}
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>

                    {/* Uploaded Materials List */}
                    {selectedCourseId && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Posted Materials</h3>

                            {uploadedFiles.length > 0 ? (
                                <div className="space-y-3">
                                    {uploadedFiles.map(file => (
                                        <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="flex items-center space-x-3 overflow-hidden">
                                                <div className="flex-shrink-0 bg-white p-2 rounded border border-gray-200">
                                                    📄
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{file.title}</p>
                                                    <p className="text-xs text-gray-500 truncate">{file.fileName} • {new Date(file.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <a
                                                    href={file.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:text-primary-dark text-sm font-medium px-2"
                                                >
                                                    View
                                                </a>
                                                <button
                                                    onClick={() => handleDeleteMaterial(file.id)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                    title="Delete"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">No materials uploaded for this course yet.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Column: Stats & Profile Summary */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Your Courses</h3>
                        {assignedCourses.length > 0 ? (
                            <ul className="space-y-3">
                                {assignedCourses.map(course => (
                                    <li key={course.id} className="flex items-center gap-3 text-sm">
                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        <span className="text-gray-700 font-medium">{course.title}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-sm">No courses assigned.</p>
                        )}
                    </div>

                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <h3 className="text-blue-900 font-semibold mb-2">Student View</h3>
                        <p className="text-blue-700 text-sm">
                            Materials you upload here will be instantly visible to enrolled students in their portal.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LecturerDashboard;
