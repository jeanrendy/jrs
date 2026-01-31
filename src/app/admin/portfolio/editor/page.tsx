"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, updateDoc, Timestamp, collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { MultiSelectBadges } from "@/components/admin/multi-select-badges";
import { ToolSelector } from "@/components/admin/tool-selector";
import { MediaManager } from "@/components/admin/media-manager";
import { Textarea } from "@/components/ui/textarea";

// --- Data Constants ---
const PREDEFINED_SERVICES = [
    "Branding", "Creative Direction", "UI/UX Design", "Motion Graphics",
    "3D Modeling", "Web Development", "Strategy", "Copywriting",
    "Illustration", "Art Direction", "Photography", "Videography",
    "Animation", "Packaging Design", "Print Design", "Social Media",
    "Marketing", "SEO", "E-commerce", "App Development", "Prototyping",
    "User Research", "Sound Design", "Editing", "VFX", "Color Grading",
    "Storyboarding", "Typography", "Iconography", "Visual Identity",
    "Logo Design", "Brand Guidelines", "Pitch Decks", "Presentations",
    "Data Visualization", "Infographics", "Environmental Design",
    "Exhibition Design", "Fashion Design", "Textile Design"
];

const PREDEFINED_CATEGORIES = [
    "Brand Identity", "Visual Design", "Development", "Art & Direction",
    "Marketing", "Motion & Video", "3D & spatial"
];

const YEARS = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString());

interface Project {
    id: string;
    // Core Fields
    title: string;          // Previous: code
    year: string;
    brandCategories: string[]; // Previous: category (single) mapped to array

    // Detailed Content
    insight: string;        // Long text
    services: string[];     // Multi-select
    tools: string[];        // Multi-select logos

    // Links
    caseStudyUrl: string;
    liveWebsiteUrl: string;

    // Legacy mapping (optional, for compatibility if needed or removed)
    code?: string;
    category?: string;

    // Media
    thumbnailUrl: string;   // Previous: src
    galleryUrls: string[];

    // Rich Text Content (keeping as description/content for compatibility or extra detail)
    description?: string; // Short summary
    content?: string;     // Full rich text

    type?: "video" | "image"; // Keeping mainly for thumbnail type
    alt?: string;

    createdAt?: any;
}

function ProjectEditorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const activeTab = searchParams.get("tab") || "showcase";
    const collectionName = activeTab === "visuals" ? "visual_productions" : "projects";

    const isNew = !id || id === "new";

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    const [project, setProject] = useState<Project>({
        id: "",
        title: "",
        year: new Date().getFullYear().toString(),
        brandCategories: [],
        insight: "",
        services: [],
        tools: [],
        caseStudyUrl: "",
        liveWebsiteUrl: "",
        thumbnailUrl: "",
        galleryUrls: [],
        type: "image",
        alt: "",
        description: "",
        content: ""
    });

    useEffect(() => {
        if (!isNew && id && db) {
            const fetchProject = async () => {
                try {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const docRef = doc(db as any, collectionName, id);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();

                        // Map legacy fields to new Schema
                        const loadedProject: Project = {
                            id: docSnap.id,
                            title: data.title || data.code || "",
                            year: data.year || new Date().getFullYear().toString(),
                            brandCategories: data.brandCategories || (data.category ? [data.category] : []),
                            insight: data.insight || data.description || "", // Use description as fallback for insight
                            services: data.services || [],
                            tools: data.tools || [],
                            caseStudyUrl: data.caseStudyUrl || "",
                            liveWebsiteUrl: data.liveWebsiteUrl || "",
                            thumbnailUrl: data.thumbnailUrl || data.src || "",
                            galleryUrls: data.galleryUrls || [],
                            type: data.type || "image",
                            alt: data.alt || "",
                            description: data.description || "",
                            content: data.content || "",
                            createdAt: data.createdAt
                        };

                        setProject(loadedProject);
                    } else {
                        alert("Project not found");
                        router.push("/admin/portfolio");
                    }
                } catch (error) {
                    console.error("Error fetching project:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProject();
        }
    }, [id, isNew, collectionName, router]);

    const handleSave = async () => {
        if (!db) return;
        if (!project.title) {
            alert("Project Title is required");
            return;
        }

        setSaving(true);
        try {
            const dataToSave = {
                // New standard fields
                title: project.title,
                year: project.year,
                brandCategories: project.brandCategories,
                insight: project.insight,
                services: project.services,
                tools: project.tools,
                caseStudyUrl: project.caseStudyUrl,
                liveWebsiteUrl: project.liveWebsiteUrl,
                thumbnailUrl: project.thumbnailUrl,
                galleryUrls: project.galleryUrls,

                // Legacy / Compatibility fields
                code: project.title,          // Keep code synced with title for now
                category: project.brandCategories[0] || "", // Primary category for old views
                src: project.thumbnailUrl,    // Main image

                // Content
                type: project.type,
                alt: project.alt,
                description: project.description,
                content: project.content,

                updatedAt: Timestamp.now(),
                ...(isNew && { createdAt: Timestamp.now() }),
            };

            if (isNew) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await addDoc(collection(db as any, collectionName), dataToSave);
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await updateDoc(doc(db as any, collectionName, id!), dataToSave);
            }

            router.push("/admin/portfolio");
        } catch (error) {
            console.error("Error saving project:", error);
            alert("Failed to save project.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-black" size={32} />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen text-gray-900 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 bg-gray-50/95 backdrop-blur z-30 py-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-gray-200 text-black">
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            {isNew ? "Create New Project" : "Edit Project"}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {isNew ? "Add a new item to your portfolio." : `Editing: ${project.title}`}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.back()} className="bg-white hover:bg-gray-100 text-black border-gray-200">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving} className="bg-black text-white hover:bg-gray-800 gap-2">
                        {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN: Main Inputs */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Basic Info */}
                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-gray-900">Project Overview</CardTitle>
                            <CardDescription className="text-gray-500">Essential project details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2 space-y-2">
                                    <Label className="text-gray-900">Project Title / Brand Name</Label>
                                    <Input
                                        value={project.title}
                                        onChange={(e) => setProject(p => ({ ...p, title: e.target.value }))}
                                        placeholder="e.g. Nike Air Campaign"
                                        className="bg-white border-gray-200 text-black placeholder:text-gray-400"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-900">Year</Label>
                                    <select
                                        value={project.year}
                                        onChange={(e) => setProject(p => ({ ...p, year: e.target.value }))}
                                        className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                    >
                                        {YEARS.map(y => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <MultiSelectBadges
                                label="Brand Categories"
                                options={PREDEFINED_CATEGORIES}
                                selected={project.brandCategories}
                                onChange={(newVal) => setProject(p => ({ ...p, brandCategories: newVal }))}
                                placeholder="Add custom category..."
                            />

                            <div className="space-y-2">
                                <Label className="text-gray-900">Project Insight / Brief</Label>
                                <Textarea
                                    value={project.insight}
                                    onChange={(e) => setProject(p => ({ ...p, insight: e.target.value }))}
                                    placeholder="Describe the challenge, the approach, and the outcome..."
                                    className="bg-white border-gray-200 text-black placeholder:text-gray-400 min-h-[120px]"
                                />
                            </div>

                            <MultiSelectBadges
                                label="Services Provided"
                                options={PREDEFINED_SERVICES}
                                selected={project.services}
                                onChange={(newVal) => setProject(p => ({ ...p, services: newVal }))}
                                placeholder="Add custom service..."
                            />

                            <ToolSelector
                                label="Tools Used"
                                selected={project.tools}
                                onChange={(newVal) => setProject(p => ({ ...p, tools: newVal }))}
                            />
                        </CardContent>
                    </Card>

                    {/* External Links */}
                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-gray-900">External Links</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-900">Case Study Link</Label>
                                    <Input
                                        value={project.caseStudyUrl}
                                        onChange={(e) => setProject(p => ({ ...p, caseStudyUrl: e.target.value }))}
                                        placeholder="https://behance.net/..."
                                        className="bg-white border-gray-200 text-black placeholder:text-gray-400"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-900">Live Website</Label>
                                    <Input
                                        value={project.liveWebsiteUrl}
                                        onChange={(e) => setProject(p => ({ ...p, liveWebsiteUrl: e.target.value }))}
                                        placeholder="https://example.com"
                                        className="bg-white border-gray-200 text-black placeholder:text-gray-400"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detailed Content (Original Rich Text) */}
                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-gray-900">Article Content</CardTitle>
                            <CardDescription className="text-gray-500">Detailed case study article (optional).</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-gray-900">Short Summary for Cards</Label>
                                <Input
                                    value={project.description || ""}
                                    onChange={(e) => setProject(p => ({ ...p, description: e.target.value }))}
                                    placeholder="Brief summary..."
                                    className="bg-white border-gray-200 text-black placeholder:text-gray-400"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-900">Full Content</Label>
                                <div className="min-h-[400px]">
                                    <RichTextEditor
                                        value={project.content || ""}
                                        onChange={(val) => setProject(p => ({ ...p, content: val }))}
                                        className="h-[350px] mb-12 text-black"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN: Media & Meta */}
                <div className="space-y-8">
                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-gray-900">Media Assets</CardTitle>
                            <CardDescription className="text-gray-500">Manage cover image and gallery.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-gray-900">Alt Text (Accessibility)</Label>
                                <Input
                                    value={project.alt || ""}
                                    onChange={(e) => setProject(p => ({ ...p, alt: e.target.value }))}
                                    placeholder="Image description..."
                                    className="bg-white border-gray-200 text-black placeholder:text-gray-400"
                                />
                            </div>

                            <MediaManager
                                thumbnailUrl={project.thumbnailUrl}
                                galleryUrls={project.galleryUrls}
                                onThumbnailChange={(url) => setProject(p => ({ ...p, thumbnailUrl: url }))}
                                onGalleryChange={(urls) => setProject(p => ({ ...p, galleryUrls: urls }))}
                                projectCode={project.title || "untitled"}
                                projectType={activeTab === "visuals" ? "video" : "portfolio"}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default function ProjectEditor() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-black" size={32} /></div>}>
            <ProjectEditorContent />
        </Suspense>
    );
}
