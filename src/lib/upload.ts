
export async function uploadFile(file: File, path: string = "uploads"): Promise<string> {
    const cloudName = "dqiw4kk2n";
    const uploadPreset = "jrsport";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    // Optional: if you want to use the 'path' as a folder hint, you can try appending it, 
    // but often presets control the folder. We'll leave it to the preset for now 
    // or add it if needed: formData.append("folder", path);

    // Determine resource type: 'video' for video files, 'image' for others
    const resourceType = file.type.startsWith("video/") ? "video" : "image";

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `Cloudinary upload failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Gagal mengunggah ke Cloudinary:", error);
        throw error;
    }
}
