"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, updateDoc, Timestamp, collection, addDoc, Firestore } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, Save } from "lucide-react";

interface Website {
    id: string;
    title: string;
    url: string;
    description: string;
    techStack: string[];
    year: string;
    order: number;
}

function WebsiteEditorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const isNew = !id || id === "new";

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form inputs state
    const [website, setWebsite] = useState<Website>({
        id: "",
        title: "",
        url: "",
        description: "",
        techStack: [],
        year: new Date().getFullYear().toString(),
        order: 0
    });

    const [techStackText, setTechStackText] = useState("");

    useEffect(() => {
        if (!db) return;

        const initializeEditor = async () => {
            if (isNew) {
                setLoading(false);
                return;
            }

            if (!id) {
                router.push("/admin/website");
                return;
            }

            try {
                const docRef = doc(db as Firestore, "websites", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const loadedSite: Website = {
                        id: docSnap.id,
                        title: data.title || "",
                        url: data.url || "",
                        description: data.description || "",
                        techStack: Array.isArray(data.techStack) ? data.techStack : [],
                        year: data.year || "",
                        order: typeof data.order === 'number' ? data.order : 0
                    };
                    setWebsite(loadedSite);
                    setTechStackText(loadedSite.techStack.join(", "));
                } else {
                    alert("Website not found");
                    router.push("/admin/website");
                }
            } catch (error) {
                console.error("Error fetching website:", error);
                alert("Error loading website.");
            } finally {
                setLoading(false);
            }
        };

        initializeEditor();
    }, [id, isNew, router, db]);

    const handleSave = async () => {
        if (!db) {
            alert("Database not connected.");
            return;
        }
        if (!website.title || !website.url) {
            alert("Title and URL are required");
            return;
        }

        setSaving(true);
        try {
            const processedTechStack = techStackText.split(",").map(s => s.trim()).filter(Boolean);

            const dataToSave = {
                title: website.title,
                url: website.url,
                description: website.description,
                techStack: processedTechStack,
                year: website.year,
                updatedAt: Timestamp.now(),
                ...(isNew && { createdAt: Timestamp.now(), order: website.order }) // Preserve order or default 0
            };

            if (isNew) {
                // Determine new order? Or default 0. Reorder page handles it.
                // Or fetch count? Simplest: 0. User can reorder.
                await addDoc(collection(db as Firestore, "websites"), dataToSave);
            } else {
                await updateDoc(doc(db as Firestore, "websites", id!), dataToSave);
            }

            router.push("/admin/website");
        } catch (error) {
            console.error("Error saving website:", error);
            alert("Failed to save website.");
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
            <div className="flex items-center justify-between sticky top-0 bg-gray-50/95 backdrop-blur z-30 py-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-gray-200 text-black">
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            {isNew ? "Add Website" : "Edit Website"}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {isNew ? "Add a new website to showcase." : `Editing: ${website.title}`}
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

            <div className="max-w-3xl mx-auto space-y-8">
                <Card className="bg-white border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-gray-900">Website Details</CardTitle>
                        <CardDescription className="text-gray-500">Information about the project.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label className="text-gray-900">Website Title</Label>
                                <Input
                                    value={website.title}
                                    onChange={(e) => setWebsite(p => ({ ...p, title: e.target.value }))}
                                    placeholder="e.g. My Portfolio"
                                    className="bg-white border-gray-200 text-black"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-900">URL</Label>
                                <Input
                                    value={website.url}
                                    onChange={(e) => setWebsite(p => ({ ...p, url: e.target.value }))}
                                    placeholder="https://example.com"
                                    className="bg-white border-gray-200 text-black"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-900">Year</Label>
                                <Input
                                    value={website.year}
                                    onChange={(e) => setWebsite(p => ({ ...p, year: e.target.value }))}
                                    placeholder="YYYY"
                                    className="bg-white border-gray-200 text-black"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-900">Description</Label>
                            <Textarea
                                value={website.description}
                                onChange={(e) => setWebsite(p => ({ ...p, description: e.target.value }))}
                                placeholder="Short description..."
                                className="bg-white border-gray-200 text-black"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-900">Tech Stack</Label>
                            <CardDescription className="mb-2">Comma separated values (e.g. React, Next.js, Tailwind)</CardDescription>
                            <Input
                                value={techStackText}
                                onChange={(e) => setTechStackText(e.target.value)}
                                placeholder="React, Node.js..."
                                className="bg-white border-gray-200 text-black"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function WebsiteEditor() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-black" size={32} /></div>}>
            <WebsiteEditorContent />
        </Suspense>
    );
}
