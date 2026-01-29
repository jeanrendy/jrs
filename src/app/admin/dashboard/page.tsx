"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PageContent {
    hero: {
        role: string;
        name: string;
        description: string;
        ctaPrimary: string;
        ctaSecondary: string;
    };
    portfolio: {
        title: string;
        description: string;
        cta?: string; // Added optional property if needed in future
    };
    blog: {
        title: string;
        description: string;
    };
    contact: {
        title: string;
        description: string;
        email: string;
        phone: string;
    };
}

const defaultContent: PageContent = {
    hero: {
        role: "Creative Developer",
        name: "JEAN RENDY",
        description: "Crafting immersive digital experiences with Code & 3D.",
        ctaPrimary: "Latest Work",
        ctaSecondary: "About Me"
    },
    portfolio: {
        title: "Selected Work.",
        description: "A collection of projects where design meets code. Focusing on user experience and performance."
    },
    blog: {
        title: "Recent Writing.",
        description: "Thoughts on design, creative coding, and the future of web."
    },
    contact: {
        title: "Let's Connect.",
        description: "Have a project in mind? Looking for a partner to build your next big thing? Reach out.",
        email: "jeanrendy@example.com",
        phone: "+1 (555) 123-4567"
    }
};

export default function AdminDashboard() {
    const [content, setContent] = useState<PageContent>(defaultContent);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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
                    setContent(docSnap.data() as PageContent);
                } else {
                    // Initialize with default if empty
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

    const handleChange = (section: keyof PageContent, field: string, value: string) => {
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
            alert("Cannot save: Firebase is not configured.");
            return;
        }
        setSaving(true);
        try {
            await setDoc(doc(db, "pages", "home"), content);
            alert("Content saved successfully!");
        } catch (error) {
            console.error("Error saving content:", error);
            alert("Failed to save content.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Loading CMS...</div>;

    return (
        <div className="flex flex-col gap-8 w-full text-gray-900">
            <div className="flex items-center justify-between py-4 border-b border-gray-200 bg-gray-50/50 backdrop-blur-sm sticky top-0 z-10">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Content Management</h1>
                <Button onClick={handleSave} disabled={saving} className="bg-black text-white hover:bg-gray-800">
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            <div className="space-y-8 pb-32">
                {/* Hero Section */}
                <Card className="bg-white border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle className="text-xl font-semibold text-gray-900">Hero Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Role (Small Tag)</label>
                                <Input className="bg-white border-gray-300 text-gray-900 focus-visible:ring-gray-400" value={content.hero.role} onChange={(e) => handleChange("hero", "role", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Name (Big Title)</label>
                                <Input className="bg-white border-gray-300 text-gray-900 focus-visible:ring-gray-400" value={content.hero.name} onChange={(e) => handleChange("hero", "name", e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Description</label>
                            <Textarea className="bg-white border-gray-300 text-gray-900 focus-visible:ring-gray-400" value={content.hero.description} onChange={(e) => handleChange("hero", "description", e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Primary CTA</label>
                                <Input className="bg-white border-gray-300 text-gray-900 focus-visible:ring-gray-400" value={content.hero.ctaPrimary} onChange={(e) => handleChange("hero", "ctaPrimary", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Secondary CTA</label>
                                <Input className="bg-white border-gray-300 text-gray-900 focus-visible:ring-gray-400" value={content.hero.ctaSecondary} onChange={(e) => handleChange("hero", "ctaSecondary", e.target.value)} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Portfolio Section */}
                <Card className="bg-white border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle className="text-xl font-semibold text-gray-900">Portfolio Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Section Title</label>
                            <Input className="bg-white border-gray-300 text-gray-900 focus-visible:ring-gray-400" value={content.portfolio.title} onChange={(e) => handleChange("portfolio", "title", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Description</label>
                            <Textarea className="bg-white border-gray-300 text-gray-900 focus-visible:ring-gray-400" value={content.portfolio.description} onChange={(e) => handleChange("portfolio", "description", e.target.value)} />
                        </div>
                    </CardContent>
                </Card>

                {/* Blog Section */}
                <Card className="bg-white border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle className="text-xl font-semibold text-gray-900">Blog Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Section Title</label>
                            <Input className="bg-white border-gray-300 text-gray-900 focus-visible:ring-gray-400" value={content.blog.title} onChange={(e) => handleChange("blog", "title", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Description</label>
                            <Textarea className="bg-white border-gray-300 text-gray-900 focus-visible:ring-gray-400" value={content.blog.description} onChange={(e) => handleChange("blog", "description", e.target.value)} />
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Section */}
                <Card className="bg-white border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle className="text-xl font-semibold text-gray-900">Contact Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Section Title</label>
                            <Input className="bg-white border-gray-300 text-gray-900 focus-visible:ring-gray-400" value={content.contact.title} onChange={(e) => handleChange("contact", "title", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Description</label>
                            <Textarea className="bg-white border-gray-300 text-gray-900 focus-visible:ring-gray-400" value={content.contact.description} onChange={(e) => handleChange("contact", "description", e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <Input className="bg-white border-gray-300 text-gray-900 focus-visible:ring-gray-400" value={content.contact.email} onChange={(e) => handleChange("contact", "email", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Phone</label>
                                <Input className="bg-white border-gray-300 text-gray-900 focus-visible:ring-gray-400" value={content.contact.phone} onChange={(e) => handleChange("contact", "phone", e.target.value)} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
