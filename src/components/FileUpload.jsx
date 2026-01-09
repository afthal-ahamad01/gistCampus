import { useState } from "react";
import { storage } from "../config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const FileUpload = ({ onUpload, initialValue, folder = "uploads", label = "File", accept = "*" }) => {
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState(initialValue || "");
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState("");
    const [fileName, setFileName] = useState("");

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
            setError("");
            uploadFile(selectedFile);
        }
    };

    const uploadFile = (fileToUpload) => {
        if (!fileToUpload) return;

        const storageRef = ref(storage, `${folder}/${Date.now()}_${fileToUpload.name}`);
        const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progressValue = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progressValue);
            },
            (err) => {
                console.error("Upload failed", err);
                setError(`Upload failed: ${err.message}`);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setFileUrl(downloadURL);
                    if (onUpload) {
                        onUpload(downloadURL, fileToUpload.name);
                    }
                    setProgress(100);
                });
            }
        );
    };

    const handleDelete = () => {
        setFile(null);
        setFileUrl("");
        setFileName("");
        setProgress(0);
        if (onUpload) onUpload("", "");
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>

            {fileUrl ? (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="flex-shrink-0">
                            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {fileName || "Uploaded File"}
                            </p>
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                                View File
                            </a>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="ml-4 p-1 rounded-full text-red-500 hover:bg-red-50"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ) : (
                <div className="w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                            <p className="text-xs text-gray-500">PDF, DOC, DOCX, PPT (Max 10MB)</p>
                        </div>
                        <input type="file" className="hidden" accept={accept} onChange={handleFileChange} />
                    </label>
                </div>
            )}

            {progress > 0 && progress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default FileUpload;
