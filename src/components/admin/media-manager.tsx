import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, Star, Check, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { cn } from "@/lib/utils";

interface MediaManagerProps {
    thumbnailUrl?: string;
    galleryUrls: string[];
    onThumbnailChange: (url: string) => void;
    onGalleryChange: (urls: string[]) => void;
    projectCode?: string; // e.g. "atelierjolie"
    projectType?: "portfolio" | "video"; // Type of project
}

export function MediaManager({
    thumbnailUrl,
    galleryUrls,
    onThumbnailChange,
    onGalleryChange,
    projectCode = "untitled",
    projectType = "portfolio"
}: MediaManagerProps) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files.length || !storage) return;

        setUploading(true);
        const files = Array.from(e.target.files);
        const newUrls: string[] = [];

        // Create folder path: projects/{projectCode}/{type}/
        const sanitizedCode = projectCode.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
        const folderPath = `projects/${sanitizedCode}/${projectType}`;

        try {
            for (const file of files) {
                const storageRef = ref(storage, `${folderPath}/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                const url = await getDownloadURL(snapshot.ref);
                newUrls.push(url);
            }

            // Add new images to gallery
            const updatedGallery = [...galleryUrls, ...newUrls];
            onGalleryChange(updatedGallery);

            // If no thumbnail exists yet, set the first new image as thumbnail automatically
            if (!thumbnailUrl && newUrls.length > 0) {
                onThumbnailChange(newUrls[0]);
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed. Check console.");
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = "";
        }
    };

    const removeGalleryItem = (urlToRemove: string) => {
        const newGallery = galleryUrls.filter(url => url !== urlToRemove);
        onGalleryChange(newGallery);

        // If the removed item was the thumbnail, clear the thumbnail or pick another one?
        if (thumbnailUrl === urlToRemove) {
            onThumbnailChange(newGallery.length > 0 ? newGallery[0] : "");
        }
    };

    const setAsThumbnail = (url: string) => {
        onThumbnailChange(url);
    };

    // Combine gallery and thumbnail visual logic
    // We display ALL unique images from galleryUrls.
    // We might also want to ensure thumbnailUrl is IN galleryUrls if it's not.
    // But typically we treat galleryUrls as the source of truth.

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <Label className="text-gray-900 font-bold text-lg">Project Gallery & Cover</Label>
                        <p className="text-sm text-gray-500">Upload images. The item marked with a star is your cover.</p>
                    </div>
                </div>

                {/* Unified Upload Box */}
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 bg-gray-50 hover:bg-gray-100 transition-colors relative text-center">
                    {uploading ? (
                        <div className="flex flex-col items-center justify-center py-4">
                            <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
                            <p className="text-sm text-gray-500">Uploading assets to secure storage...</p>
                        </div>
                    ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-3 w-full h-full">
                            <div className="p-4 bg-white rounded-full shadow-sm">
                                <Upload className="text-blue-600" size={28} />
                            </div>
                            <div>
                                <span className="text-base font-semibold text-gray-900">Click to upload</span>
                                <span className="text-gray-500"> or drag and drop</span>
                            </div>
                            <p className="text-xs text-gray-400">JPG, PNG, GIF, MP4 allowed</p>
                            <input
                                type="file"
                                multiple
                                className="hidden"
                                accept="image/*,video/*"
                                onChange={handleUpload}
                            />
                        </label>
                    )}
                </div>

                {/* Gallery Grid */}
                {galleryUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
                        {galleryUrls.map((url, idx) => {
                            const isCover = url === thumbnailUrl;
                            return (
                                <div
                                    key={idx}
                                    className={cn(
                                        "relative group aspect-square rounded-xl overflow-hidden shadow-sm transition-all duration-200",
                                        isCover ? "ring-4 ring-black ring-offset-2" : "border border-gray-100"
                                    )}
                                >
                                    {url.includes(".mp4") ? (
                                        <video src={url} className="w-full h-full object-cover" />
                                    ) : (
                                        <Image
                                            src={url}
                                            alt={`Gallery ${idx}`}
                                            fill
                                            className="object-cover bg-gray-100"
                                        />
                                    )}

                                    {/* Cover Indicator */}
                                    {isCover && (
                                        <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm z-10">
                                            <Star size={10} fill="currentColor" /> COVER
                                        </div>
                                    )}

                                    {/* Overlay Actions */}
                                    <div className={cn(
                                        "absolute inset-0 bg-black/60 transition-opacity flex flex-col items-center justify-center gap-2 p-2",
                                        "opacity-0 group-hover:opacity-100"
                                    )}>
                                        {!isCover && (
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="h-8 text-xs w-full bg-white hover:bg-gray-100 text-black font-medium"
                                                onClick={() => setAsThumbnail(url)}
                                            >
                                                Set as Cover
                                            </Button>
                                        )}
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="h-8 text-xs w-full bg-red-500/90 hover:bg-red-600"
                                            onClick={() => removeGalleryItem(url)}
                                        >
                                            <X size={12} className="mr-1" /> Remove
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
