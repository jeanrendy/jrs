
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadFile(file: File, path: string = "uploads"): Promise<string> {
    if (!storage) throw new Error("Firebase Storage is not initialized");

    // Create a unique filename
    const timestamp = Date.now();
    const uniqueName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const storageRef = ref(storage, `${path}/${uniqueName}`);

    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
}
