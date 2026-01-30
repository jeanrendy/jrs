"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save } from "lucide-react";

interface GlobalSettings {
    siteName: string;
    contactEmail: string;
    social: {
        instagram: string;
        linkedin: string;
        twitter: string;
        github: string;
    };
    theme: {
        defaultMode: "light" | "dark" | "system";
    };
}

const defaultSettings: GlobalSettings = {
    siteName: "Jean Rendy Portfolio",
    contactEmail: "hello@jeanrendy.com",
    social: {
        instagram: "",
        linkedin: "",
        twitter: "",
        github: ""
    },
    theme: {
        defaultMode: "system"
    }
};

export default function AdminSettings() {
    const [settings, setSettings] = useState<GlobalSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            if (!db) {
                setLoading(false);
                return;
            }
            try {
                const docRef = doc(db, "settings", "global");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSettings({ ...defaultSettings, ...docSnap.data() } as GlobalSettings);
                } else {
                    await setDoc(docRef, defaultSettings);
                }
            } catch (error) {
                console.error("Error loading settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (section: string, field: string, value: string) => {
        if (section === 'root') {
            setSettings(prev => ({ ...prev, [field]: value }));
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setSettings(prev => ({
                ...prev,
                [section]: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ...(prev as any)[section],
                    [field]: value
                }
            }));
        }
    };

    const handleSave = async () => {
        if (!db) return;
        setSaving(true);
        try {
            await setDoc(doc(db, "settings", "global"), settings);
            alert("Settings saved successfully.");
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center">Loading Settings...</div>;

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
                    <p className="text-gray-500">Manage global website configurations.</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-black text-white hover:bg-gray-800 gap-2">
                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>General Information</CardTitle>
                        <CardDescription>Basic site details and contact info.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Site Name</Label>
                            <Input
                                value={settings.siteName}
                                onChange={(e) => handleChange("root", "siteName", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Contact Email</Label>
                            <Input
                                type="email"
                                value={settings.contactEmail}
                                onChange={(e) => handleChange("root", "contactEmail", e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">Used for the contact form target.</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Social Media Links</CardTitle>
                        <CardDescription>URL links for your social profiles.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Instagram</Label>
                            <Input
                                placeholder="https://instagram.com/..."
                                value={settings.social.instagram}
                                onChange={(e) => handleChange("social", "instagram", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>LinkedIn</Label>
                            <Input
                                placeholder="https://linkedin.com/in/..."
                                value={settings.social.linkedin}
                                onChange={(e) => handleChange("social", "linkedin", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Twitter / X</Label>
                            <Input
                                placeholder="https://x.com/..."
                                value={settings.social.twitter}
                                onChange={(e) => handleChange("social", "twitter", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>GitHub</Label>
                            <Input
                                placeholder="https://github.com/..."
                                value={settings.social.github}
                                onChange={(e) => handleChange("social", "github", e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>Control the default look and feel.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Default Theme</Label>
                                <p className="text-xs text-muted-foreground">Sets the initial theme for new visitors.</p>
                            </div>
                            <select
                                className="border rounded-md p-2 text-sm bg-background text-foreground"
                                value={settings.theme.defaultMode}
                                onChange={(e) => handleChange("theme", "defaultMode", e.target.value)}
                            >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="system">System</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
