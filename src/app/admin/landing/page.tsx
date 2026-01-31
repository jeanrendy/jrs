"use client";

import { useEffect, useState, useRef } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hero } from "@/components/sections/hero-v2";
import { FeaturesSection } from "@/components/sections/features";
import { CursorProvider } from "@/context/cursor-context";
import { Smartphone, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageContent {
    hero: {
        availabilityText: string;
        titleLine1: string;
        titleLine2: string;
        titleLine3Part1: string;
        titleLine3Part2: string;
        description: string;
        profileImage: string;
    };
    digitalPlayground: {
        title: string;
        description: string;
    };
    blog: {
        title: string;
        description: string;
    };
}

const defaultContent: PageContent = {
    hero: {
        availabilityText: "Limited Availability",
        titleLine1: "Hey There!",
        titleLine2: "Let's Make",
        titleLine3Part1: "Something",
        titleLine3Part2: "Awesome",
        description: "I'm Jean, your digital design sidekick. Got a crazy idea? Let's bring it to life! I'm a full-stack designer, which means I can handle almost everything.",
        profileImage: "/assets/prof2.png"
    },
    digitalPlayground: {
        title: "My Digital Playground",
        description: "This is where curiosity meets craft. Whether I'm building with AI, sculpting in 3D, or refining a brand's visual identity."
    },
    blog: {
        title: "Recent Writing.",
        description: "Thoughts on design, creative coding, and the future of web."
    }
};

export default function AdminLanding() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [content, setContent] = useState<PageContent>(defaultContent);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
    const [activeTab, setActiveTab] = useState<"hero" | "features" | "blog">("hero");

    // Refs for input focus
    const inputRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>({});

    useEffect(() => {
        const loadContent = async () => {
            if (!db) {
                setLoading(false);
                return;
            }
            try {
                const docRef = doc(db, "pages", "home");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setContent(prev => ({
                        ...prev,
                        ...data,
                        hero: { ...prev.hero, ...data.hero },
                        digitalPlayground: { ...prev.digitalPlayground, ...data.digitalPlayground },
                        blog: { ...prev.blog, ...data.blog }
                    }));
                } else {
                    await setDoc(docRef, defaultContent);
                }
            } catch (error) {
                console.error("Error loading content:", error);
            } finally {
                setLoading(false);
            }
        };
        loadContent();
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (section: keyof PageContent, field: string, value: any) => {
        setContent(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleSave = async () => {
        if (!db) {
            alert('Firebase not initialized');
            return;
        }
        setSaving(true);
        try {
            await setDoc(doc(db, "pages", "home"), content);
            alert('Saved successfully');
        } catch (error) {
            console.error("Error saving content:", error);
            alert('Error saving content');
        } finally {
            setSaving(false);
        }
    };

    const handleFieldClick = (fieldPath: string) => {
        const [section, field] = fieldPath.split('.');
        if (section === 'hero') setActiveTab('hero');
        if (section === 'digitalPlayground') setActiveTab('features');
        // Focus logic
        setTimeout(() => {
            const el = inputRefs.current[fieldPath];
            if (el) {
                el.focus();
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    };

    // Helper to register ref
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setRef = (section: string, field: string) => (el: any) => {
        inputRefs.current[`${section}.${field}`] = el;
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;
        const file = e.target.files[0];
        try {
            const { uploadFile } = await import("@/lib/upload");
            const url = await uploadFile(file, "profile");
            handleChange("hero", "profileImage", url);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed");
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center">Loading Editor...</div>;

    return (
        <div className="flex h-screen w-full overflow-hidden bg-gray-100">
            {/* LEFT COLUMN: EDITOR FORM */}
            <div className="w-[450px] flex-shrink-0 flex flex-col border-r border-gray-200 bg-white h-full shadow-xl z-20">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Landing Page Editor</h1>
                        <p className="text-xs text-gray-500">Edit homepage content</p>
                    </div>
                    <Button onClick={handleSave} disabled={saving} size="sm" className="bg-black text-white hover:bg-gray-800">
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>

                <div className="flex items-center p-2 bg-gray-50 border-b border-gray-100">
                    {["hero", "features", "blog"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={cn(
                                "flex-1 py-2 text-sm font-medium capitalize rounded-md transition-colors",
                                activeTab === tab ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {activeTab === "hero" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Hero Typography</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500">Availability Tag</label>
                                    <Input
                                        ref={setRef("hero", "availabilityText")}
                                        value={content.hero.availabilityText}
                                        onChange={(e) => handleChange("hero", "availabilityText", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500">Title Line 1 (Small Top)</label>
                                    <Input
                                        ref={setRef("hero", "titleLine1")}
                                        value={content.hero.titleLine1}
                                        onChange={(e) => handleChange("hero", "titleLine1", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500">Title Line 2 (Bold Main)</label>
                                    <Input
                                        ref={setRef("hero", "titleLine2")}
                                        value={content.hero.titleLine2}
                                        onChange={(e) => handleChange("hero", "titleLine2", e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500">Title Line 3 (Part 1)</label>
                                        <Input
                                            ref={setRef("hero", "titleLine3Part1")}
                                            value={content.hero.titleLine3Part1}
                                            onChange={(e) => handleChange("hero", "titleLine3Part1", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500">Title Line 3 (Part 2)</label>
                                        <Input
                                            ref={setRef("hero", "titleLine3Part2")}
                                            value={content.hero.titleLine3Part2}
                                            onChange={(e) => handleChange("hero", "titleLine3Part2", e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500">Description</label>
                                    <RichTextEditor
                                        value={content.hero.description}
                                        onChange={(val) => handleChange("hero", "description", val)}
                                        className="min-h-[150px]"
                                    />

                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500">Profile Image</label>
                                    <div className="flex flex-col gap-2">
                                        <div className="relative w-full h-[200px] bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={content.hero.profileImage || "/assets/prof2.png"} alt="Preview" className="w-full h-full object-contain" />
                                        </div>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="bg-white border-gray-200 text-black cursor-pointer text-xs"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "features" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Digital Playground</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500">Section Title</label>
                                    <Input value={content.digitalPlayground.title} onChange={(e) => handleChange("digitalPlayground", "title", e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500">Description</label>
                                    <Textarea
                                        value={content.digitalPlayground.description}
                                        onChange={(e) => handleChange("digitalPlayground", "description", e.target.value)}
                                        className="min-h-[100px]"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "blog" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Blog Section</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500">Section Title</label>
                                    <Input value={content.blog.title} onChange={(e) => handleChange("blog", "title", e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500">Description</label>
                                    <Textarea
                                        value={content.blog.description}
                                        onChange={(e) => handleChange("blog", "description", e.target.value)}
                                        className="min-h-[100px]"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* RIGHT COLUMN: LIVE PREVIEW */}
            <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden relative">
                {/* Preview Toolbar */}
                <div className="bg-white border-b border-gray-200 p-2 flex items-center justify-center gap-4 relative z-20 shadow-sm">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Live Preview</span>
                    <div className="flex rounded-md bg-gray-100 p-1">
                        <button
                            onClick={() => setPreviewMode("desktop")}
                            className={`p-1.5 rounded ${previewMode === "desktop" ? "bg-white shadow text-black" : "text-gray-400 hover:text-gray-600"}`}
                        >
                            <Monitor size={16} />
                        </button>
                        <button
                            onClick={() => setPreviewMode("mobile")}
                            className={`p-1.5 rounded ${previewMode === "mobile" ? "bg-white shadow text-black" : "text-gray-400 hover:text-gray-600"}`}
                        >
                            <Smartphone size={16} />
                        </button>
                    </div>
                </div>

                {/* Preview Container */}
                <div className="flex-1 overflow-hidden flex items-center justify-center p-8 bg-[url('/assets/grid-iso.svg')] bg-repeat">
                    <div
                        className={`transition-all duration-500 ease-in-out bg-background shadow-2xl overflow-y-auto no-scrollbar relative border-[8px] border-gray-900 rounded-[20px] ${previewMode === "mobile" ? "w-[375px] h-[812px]" : "w-full h-full max-w-[1600px] border-none rounded-none"
                            }`}
                    >
                        {/* 
                           We force 'dark' class here because the components are designed for dark mode 
                           and the admin panel layout enforces 'light' theme.
                        */}
                        <CursorProvider>
                            <div className="min-h-full bg-background text-foreground dark">
                                <Hero content={content.hero} onFieldClick={handleFieldClick} />
                                <div className="relative z-20 bg-background">
                                    <FeaturesSection content={content.digitalPlayground} />
                                </div>
                            </div>
                        </CursorProvider>
                    </div>
                </div>
            </div>
        </div>
    );
}
