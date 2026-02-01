"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, updateDoc, setDoc, Timestamp, collection, addDoc, Firestore } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { STATIC_EXPERIENCES, type Experience } from "@/data/experiences";

function ExperienceEditorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const isNew = !id || id === "new";

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isPresent, setIsPresent] = useState(false);
    const [isFallback, setIsFallback] = useState(false); // Track if loaded from Static data (not DB)

    // Form inputs state
    const [experience, setExperience] = useState<Experience>({
        id: "",
        title: "",
        company: "",
        companyUrl: "",
        location: "",
        locationType: "Remote",
        startDate: "",
        endDate: null,
        duration: "",
        description: [],
        skills: []
    });

    // Helper states for array inputs
    const [descText, setDescText] = useState("");
    const [skillsText, setSkillsText] = useState("");

    // Effect to handle initialization and fetching
    useEffect(() => {
        // If db is not yet initialized, wait.
        if (!db) return;

        const initializeEditor = async () => {
            if (isNew) {
                setLoading(false);
                return;
            }

            if (!id) {
                router.push("/admin/experience");
                return;
            }

            try {
                const docRef = doc(db as Firestore, "experiences", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    // Found in DB
                    const data = docSnap.data();
                    const loadedExp: Experience = {
                        id: docSnap.id,
                        title: data.title || "",
                        company: data.company || "",
                        companyUrl: data.companyUrl || "",
                        location: data.location || "",
                        locationType: data.locationType || "Remote",
                        startDate: data.startDate || "",
                        endDate: data.endDate || null,
                        duration: data.duration || "",
                        description: Array.isArray(data.description) ? data.description : [],
                        skills: Array.isArray(data.skills) ? data.skills : []
                    };
                    setExperience(loadedExp);
                    setDescText(loadedExp.description.join("\n"));
                    setSkillsText(loadedExp.skills.join(", "));
                    setIsPresent(loadedExp.endDate === null);
                } else {
                    // Not found in DB, check Static Data Fallback
                    console.warn(`Experience ${id} not found in DB. Checking static data.`);
                    const staticExp = STATIC_EXPERIENCES.find(e => e.id === id);

                    if (staticExp) {
                        setExperience(staticExp);
                        setDescText(staticExp.description.join("\n"));
                        setSkillsText(staticExp.skills.join(", "));
                        setIsPresent(staticExp.endDate === null);
                        setIsFallback(true); // Mark as fallback so we use setDoc (create) instead of updateDoc
                    } else {
                        alert(`Experience not found (ID: ${id}).`);
                        router.push("/admin/experience");
                    }
                }
            } catch (error) {
                console.error("Error fetching experience:", error);
                alert("Error loading experience.");
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
        if (!experience.title || !experience.company) {
            alert("Title and Company are required");
            return;
        }

        setSaving(true);
        try {
            // Process Arrays
            const processedDesc = descText.split("\n").map(s => s.trim()).filter(Boolean);
            const processedSkills = skillsText.split(",").map(s => s.trim()).filter(Boolean);

            const dataToSave = {
                title: experience.title,
                company: experience.company,
                companyUrl: experience.companyUrl || "",
                location: experience.location,
                locationType: experience.locationType,
                startDate: experience.startDate,
                endDate: isPresent ? null : experience.endDate,
                duration: experience.duration,
                description: processedDesc,
                skills: processedSkills,
                updatedAt: Timestamp.now(),
                ...(isNew && { createdAt: Timestamp.now() })
            };

            if (isNew) {
                // Create new
                await addDoc(collection(db as Firestore, "experiences"), dataToSave);
            } else if (isFallback && id) {
                // If loaded from static fallback, use setDoc to create/overwrite at that ID
                await setDoc(doc(db as Firestore, "experiences", id), {
                    ...dataToSave,
                    createdAt: Timestamp.now() // Treat as new in DB
                });
            } else if (id) {
                // Standard update
                await updateDoc(doc(db as Firestore, "experiences", id), dataToSave);
            }

            alert("Experience saved successfully!");
            router.push("/admin/experience");
        } catch (error) {
            console.error("Error saving experience:", error);
            alert("Failed to save experience: " + (error instanceof Error ? error.message : "Unknown error"));
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
                            {isNew ? "Add Experience" : "Edit Experience"}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {isNew ? "Add a new role." : (isFallback ? `Creating Database Entry for: ${experience.title}` : `Editing: ${experience.title}`)}
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
                        <CardTitle className="text-gray-900">Role Details</CardTitle>
                        <CardDescription className="text-gray-500">Basic information about the position.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-gray-900">Job Title</Label>
                                <Input
                                    value={experience.title}
                                    onChange={(e) => setExperience(p => ({ ...p, title: e.target.value }))}
                                    placeholder="e.g. Senior Designer"
                                    className="bg-white border-gray-200 text-black"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-900">Company Name</Label>
                                <Input
                                    value={experience.company}
                                    onChange={(e) => setExperience(p => ({ ...p, company: e.target.value }))}
                                    placeholder="e.g. Google"
                                    className="bg-white border-gray-200 text-black"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-900">Company URL (Optional)</Label>
                                <Input
                                    value={experience.companyUrl || ""}
                                    onChange={(e) => setExperience(p => ({ ...p, companyUrl: e.target.value }))}
                                    placeholder="https://"
                                    className="bg-white border-gray-200 text-black"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-900">Location Type</Label>
                                <select
                                    value={experience.locationType}
                                    onChange={(e) => setExperience(p => ({ ...p, locationType: e.target.value }))}
                                    className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                    <option value="Remote">Remote</option>
                                    <option value="On-site">On-site</option>
                                    <option value="Hybrid">Hybrid</option>
                                    <option value="Freelance">Freelance</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <Label className="text-gray-900">Location</Label>
                                <Input
                                    value={experience.location}
                                    onChange={(e) => setExperience(p => ({ ...p, location: e.target.value }))}
                                    placeholder="e.g. San Francisco, US"
                                    className="bg-white border-gray-200 text-black"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                            <div className="space-y-2">
                                <Label className="text-gray-900">Start Date</Label>
                                <Input
                                    value={experience.startDate}
                                    onChange={(e) => setExperience(p => ({ ...p, startDate: e.target.value }))}
                                    placeholder="e.g. Jan 2024"
                                    className="bg-white border-gray-200 text-black"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between mb-2">
                                    <Label className="text-gray-900">End Date</Label>
                                    <div className="flex items-center gap-2">
                                        <Label htmlFor="present-mode" className="text-xs text-gray-500 cursor-pointer">Present?</Label>
                                        <Switch
                                            id="present-mode"
                                            checked={isPresent}
                                            onCheckedChange={(checked) => {
                                                setIsPresent(checked);
                                                if (checked) setExperience(p => ({ ...p, endDate: null }));
                                            }}
                                        />
                                    </div>
                                </div>
                                <Input
                                    value={experience.endDate || ""}
                                    onChange={(e) => setExperience(p => ({ ...p, endDate: e.target.value }))}
                                    placeholder="e.g. Dec 2024"
                                    disabled={isPresent}
                                    className="bg-white border-gray-200 text-black disabled:bg-gray-100 disabled:text-gray-400"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-900">Duration (Display)</Label>
                                <Input
                                    value={experience.duration}
                                    onChange={(e) => setExperience(p => ({ ...p, duration: e.target.value }))}
                                    placeholder="e.g. 1 yr 2 mos"
                                    className="bg-white border-gray-200 text-black"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-900">Description (Bullets)</Label>
                            <CardDescription className="mb-2">Enter each point on a new line.</CardDescription>
                            <Textarea
                                value={descText}
                                onChange={(e) => setDescText(e.target.value)}
                                placeholder="- Led design team..."
                                className="bg-white border-gray-200 text-black min-h-[150px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-900">Skills</Label>
                            <CardDescription className="mb-2">Comma separated values.</CardDescription>
                            <Input
                                value={skillsText}
                                onChange={(e) => setSkillsText(e.target.value)}
                                placeholder="Figma, React, Leadership..."
                                className="bg-white border-gray-200 text-black"
                            />
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function ExperienceEditor() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-black" size={32} /></div>}>
            <ExperienceEditorContent />
        </Suspense>
    );
}
