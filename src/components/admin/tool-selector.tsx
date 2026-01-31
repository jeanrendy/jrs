import { useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Upload, X, Loader2, Plus } from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

const PRESET_TOOLS = [
    "adobe illustrator.png", "aftereffect.png", "aistudio.png", "antigravity.png",
    "blender.png", "canon.png", "canva.png", "capcut.png", "chatgpt.png",
    "cinema4d.png", "claude.png", "clickup.png", "figma.png", "framer.png",
    "gemini.png", "lightroom.png", "midjourney.png", "photoshop.png",
    "premiere.png", "vercel.png", "webflow.png", "xd.png"
];

interface ToolSelectorProps {
    selected: string[];
    onChange: (selected: string[]) => void;
    label?: string;
}

export function ToolSelector({ selected, onChange, label }: ToolSelectorProps) {
    const [uploading, setUploading] = useState(false);

    // Derived state: Custom tools are those in 'selected' that are NOT in PRESET_TOOLS
    // This allows us to display them in the grid even if they were added previously
    const customTools = selected.filter(t => !PRESET_TOOLS.includes(t));

    // Combine presets and any custom tools currently selected (so they show up in grid)
    // Note: If you unselect a custom tool, it disappears from the grid with this logic.
    // If we want persistent custom tools during the session, we'd need local state.
    // For now, let's just make sure uploaded tools persist in the list by adding them to 'selected'.

    const allToolsToDisplay = [...PRESET_TOOLS, ...customTools];

    const toggleTool = (tool: string) => {
        if (selected.includes(tool)) {
            onChange(selected.filter(t => t !== tool));
        } else {
            onChange([...selected, tool]);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files.length || !storage) return;

        setUploading(true);
        const file = e.target.files[0];

        try {
            const storageRef = ref(storage, `tools/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);

            // Add the new tool to selected immediately
            onChange([...selected, url]);
        } catch (error) {
            console.error("Tool upload failed", error);
            alert("Failed to upload tool icon.");
        } finally {
            setUploading(false);
            e.target.value = ""; // Reset input
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                {label && <label className="text-sm font-medium text-gray-900">{label}</label>}
                <span className="text-xs text-muted-foreground">{selected.length} selected</span>
            </div>

            {/* Selected Tools Chips */}
            {selected.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 mb-2">
                    {selected.map((tool) => {
                        const isUrl = tool.startsWith("http");
                        const name = isUrl
                            ? "Custom Tool"
                            : tool.replace(".png", "").replace(/[-_]/g, " ");

                        return (
                            <div key={tool} className="flex items-center gap-2 bg-white border border-gray-200 pl-2 pr-1 py-1 rounded-full shadow-sm text-sm">
                                <div className="relative w-4 h-4">
                                    <Image
                                        src={isUrl ? tool : `/assets/minilog/${tool}`}
                                        fill
                                        alt={name}
                                        className="object-contain"
                                    />
                                </div>
                                <span className="capitalize">{name}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleTool(tool); }}
                                    className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 border rounded-lg p-4 bg-white border-gray-200 max-h-[400px] overflow-y-auto">
                {/* Upload Button */}
                <label className="aspect-square flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-blue-400 cursor-pointer transition-colors group">
                    <div className="p-2 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                        {uploading ? <Loader2 className="animate-spin text-blue-500" size={16} /> : <Plus className="text-blue-500" size={16} />}
                    </div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 mt-2 group-hover:text-blue-500">Add New</span>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploading}
                        onChange={handleFileUpload}
                    />
                </label>

                {allToolsToDisplay.map((tool) => {
                    const isSelected = selected.includes(tool);
                    const isUrl = tool.startsWith("http");
                    const name = isUrl
                        ? tool.split('/').pop() || "Custom Tool"
                        : tool.replace(".png", "").replace(/[-_]/g, " ");

                    return (
                        <div
                            key={tool}
                            onClick={() => toggleTool(tool)}
                            className={cn(
                                "group relative aspect-square flex items-center justify-center rounded-xl cursor-pointer transition-all duration-200 border",
                                isSelected
                                    ? "bg-blue-50/50 border-blue-500 shadow-sm ring-1 ring-blue-500"
                                    : "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                            )}
                            title={name}
                        >
                            <div className="relative w-8 h-8">
                                <Image
                                    src={isUrl ? tool : `/assets/minilog/${tool}`}
                                    alt={name}
                                    fill
                                    className={cn(
                                        "object-contain transition-all duration-200",
                                        isSelected ? "grayscale-0 scale-110" : "grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100"
                                    )}
                                />
                            </div>
                            {isSelected && (
                                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 shadow-sm" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
