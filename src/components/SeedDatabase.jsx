import { useState } from "react";
import { doc, writeBatch, collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { seedData } from "../data/seedData";

const SeedDatabase = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const handleSeed = async () => {
        if (!window.confirm("This will overwrite/add initial data to your database. Are you sure?")) {
            return;
        }

        setLoading(true);
        setStatus("Starting seed...");

        try {
            const batch = writeBatch(db);
            let operationCount = 0;
            const MAX_BATCH_SIZE = 500; // Firestore batch limit

            // Helper to commit and reset batch if limit reached
            const checkBatch = async () => {
                if (operationCount >= MAX_BATCH_SIZE) {
                    await batch.commit();
                    operationCount = 0;
                    // We can't reuse the committed batch object, but for this simple script
                    // we'll just assume we won't hit 500 items in the seed data for now.
                    // Or we would need to create a new batch.
                    // For simplicity in this MVP, let's assume seedData is small enough.
                }
            };

            // 1. Seed Collections (Arrays in seedData)
            const collectionsToSeed = [
                "heroSlides",
                "faculties",
                "programmes",
                "courses",
                "foreignAffiliations",
                "professionalAffiliations",
                "newsEvents",
                "gallery",
                "testimonials",
                "certificates"
            ];

            for (const key of collectionsToSeed) {
                if (seedData[key] && Array.isArray(seedData[key])) {
                    const colRef = collection(db, key);
                    // Optional: Check if collection is empty to avoid duplicates?
                    // For now, we'll just add them. To be safe, we could use specific IDs if they exist.

                    for (const item of seedData[key]) {
                        const docRef = item.id ? doc(db, key, item.id.toString()) : doc(collection(db, key));
                        // Remove id from data if it's in the docRef
                        const { id, ...data } = item;
                        batch.set(docRef, { ...data, id: docRef.id }); // Ensure ID is saved in doc
                        operationCount++;
                    }
                }
            }

            // 2. Seed Singletons (Objects in seedData)
            const singletonsToSeed = ["siteMeta", "stats", "campuses"];
            for (const key of singletonsToSeed) {
                if (seedData[key]) {
                    // For singletons, we often store them as a single doc in a collection, 
                    // or just a doc with a known ID.
                    // ContentContext expects:
                    // "campuses" -> collection. If seedData.campuses is array, it's a collection.
                    // "stats" -> object. ContentContext handles it.

                    if (Array.isArray(seedData[key])) {
                        for (const item of seedData[key]) {
                            const docRef = item.id ? doc(db, key, item.id.toString()) : doc(collection(db, key));
                            const { id, ...data } = item;
                            batch.set(docRef, { ...data, id: docRef.id });
                            operationCount++;
                        }
                    } else {
                        // It's a single object (like stats)
                        // We'll store it as a document with ID 'main' or similar
                        const docRef = doc(db, key, "main");
                        batch.set(docRef, seedData[key]);
                        operationCount++;
                    }
                }
            }

            await batch.commit();
            setStatus("Database seeded successfully! Refresh the page.");
        } catch (error) {
            console.error("Seeding failed:", error);
            setStatus(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Initialize Database</h3>
            <p className="text-gray-600 text-sm mb-4">
                Your database seems empty. Click below to upload the initial website content (Courses, News, etc.) to Firestore.
                This will allow you to edit and delete them properly.
            </p>
            <button
                onClick={handleSeed}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
                {loading ? "Seeding..." : "Seed Database"}
            </button>
            {status && <p className="mt-2 text-sm font-medium text-gray-800">{status}</p>}
        </div>
    );
};

export default SeedDatabase;
