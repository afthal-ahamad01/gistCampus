import { useState } from "react";
import { storage } from "../../config/firebase";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

const ImageUpload = ({ onUpload, initialValue, folder = "uploads", label = "Image" }) => {
    const [file, setFile] = useState("");
    const [preview, setPreview] = useState(initialValue || "");
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setError("");
            // Auto upload on select or could be manual
            uploadImage(selectedFile);
        }
    };

    const uploadImage = (fileToUpload) => {
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
                    setPreview(downloadURL);
                    if (onUpload) {
                        onUpload(downloadURL);
                    }
                    setProgress(100);
                });
            }
        );
    };

    const handleDelete = () => {
        // Optional: Delete from storage if needed, but for now just clear local state
        // If we wanted to delete from storage, we'd need the full path or ref
        setFile(null);
        setPreview("");
        setProgress(0);
        if (onUpload) onUpload("");
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">{label}</label>

            {preview ? (
                <div className="relative w-full max-w-xs">
                    <img
                        src={preview}
                        alt="Preview"
                        className="rounded-lg shadow-sm max-h-48 object-cover border border-gray-200"
                    />
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md text-red-500 hover:text-red-700 focus:outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                    {progress > 0 && progress < 100 && (
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg">
                            <span className="text-white font-semibold">{progress}%</span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                            <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                </div>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default ImageUpload;
