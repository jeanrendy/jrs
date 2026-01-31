"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, query, orderBy, Timestamp, writeBatch } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Trash2, RefreshCw, Pencil } from "lucide-react";
import Image from "next/image";

interface Project {
    id: string;
    code: string; // Used as Title/Brand Name
    category: string;
    src: string;
    type?: "video" | "image"; // For visual production
    alt?: string;
    createdAt: any;
}

export default function AdminPortfolio() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [visuals, setVisuals] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [importing, setImporting] = useState(false);
    const [activeTab, setActiveTab] = useState("showcase");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        code: "",
        category: "",
        src: "",
        type: "image", // Default
        alt: ""
    });

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        if (!db) return;
        setLoading(true);
        try {
            // 1. Fetch Showcase Projects
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const qProjects = query(collection(db as any, "projects"), orderBy("createdAt", "desc"));
            const snapsProjects = await getDocs(qProjects);
            const fetchedProjects: Project[] = [];
            snapsProjects.forEach((doc) => {
                fetchedProjects.push({ id: doc.id, ...doc.data() } as Project);
            });
            setProjects(fetchedProjects);

            // 2. Fetch Visual Productions
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const qVisuals = query(collection(db as any, "visual_productions"), orderBy("createdAt", "desc"));
            const snapsVisuals = await getDocs(qVisuals);
            const fetchedVisuals: Project[] = [];
            snapsVisuals.forEach((doc) => {
                fetchedVisuals.push({ id: doc.id, ...doc.data() } as Project);
            });
            setVisuals(fetchedVisuals);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!db) return;
        setSubmitting(true);
        const collectionName = activeTab === "showcase" ? "projects" : "visual_productions";

        try {
            let currentSrc = formData.src;

            if (file && storage) {
                const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                currentSrc = await getDownloadURL(snapshot.ref);
            }

            if (editingId) {
                // Update existing
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await updateDoc(doc(db as any, collectionName, editingId), {
                    ...formData,
                    src: currentSrc
                    // Don't update createdAt usually, or maybe update updatedAt
                });
            } else {
                // Add new
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await addDoc(collection(db as any, collectionName), {
                    ...formData,
                    src: currentSrc,
                    createdAt: Timestamp.now()
                });
            }

            setIsOpen(false);
            resetForm();
            fetchAll();
        } catch (error) {
            console.error("Error saving item:", error);
            alert("Failed to save item.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (item: Project) => {
        setFormData({
            code: item.code || "",
            category: item.category || "",
            src: item.src || "",
            type: (item.type || "image"),
            alt: item.alt || ""
        });
        setEditingId(item.id);
        setIsOpen(true);
    };

    const resetForm = () => {
        setFormData({ code: "", category: "", src: "", type: "image", alt: "" });
        setEditingId(null);
        setFile(null);
    };

    const openNewDialog = () => {
        resetForm();
        setIsOpen(true);
    };

    const handleDelete = async (id: string, collectionName: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        if (!db) return;
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await deleteDoc(doc(db as any, collectionName, id));
            if (collectionName === "projects") {
                setProjects(prev => prev.filter(p => p.id !== id));
            } else {
                setVisuals(prev => prev.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    const importFromStatic = async () => {
        if (!db) return;
        if (!confirm("This will import data from the static API files into Firestore. Continue?")) return;

        setImporting(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const batch = writeBatch(db as any);
        let count = 0;

        try {
            // Import Showcase Projects
            if (projects.length === 0) {
                const res = await fetch('/api/brand-design-images');
                const data = await res.json();
                if (Array.isArray(data)) {
                    data.forEach((path: string) => {
                        const filename = path.split('/').pop() || '';
                        const brandName = filename.replace(/\.[^/.]+$/, "");
                        let category = "Branding & Visual Identity";
                        if (brandName === "Atelier Jolie") category = "Art, Fashion & Community";
                        if (brandName === "Gridhaus") category = "Sports & Lifestyle";

                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const docRef = doc(collection(db as any, "projects"));
                        batch.set(docRef, {
                            code: brandName,
                            category: category,
                            src: path,
                            type: 'image',
                            createdAt: Timestamp.now()
                        });
                        count++;
                    });
                }
            }

            // Import Visual Productions
            if (visuals.length === 0) {
                const res = await fetch('/api/visual-production-videos');
                const data = await res.json();
                if (Array.isArray(data)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    data.forEach((item: any) => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const docRef = doc(collection(db as any, "visual_productions"));
                        batch.set(docRef, {
                            code: item.alt || "Visual Project", // Mapping alt to code/title
                            category: "Visual Production",
                            src: item.src,
                            type: item.type,
                            alt: item.alt,
                            createdAt: Timestamp.now()
                        });
                        count++;
                    });
                }
            }

            if (count > 0) {
                await batch.commit();
                alert(`Successfully imported ${count} items.`);
                fetchAll();
            } else {
                alert("No new items to import (Firestore might already have data).");
            }

        } catch (error) {
            console.error("Import failed:", error);
            alert("Import failed.");
        } finally {
            setImporting(false);
        }
    };

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen text-gray-900">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Portfolio & Visuals</h1>
                    <p className="text-gray-500">Manage your projects and visual productions.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={importFromStatic} disabled={importing} className="gap-2 bg-white text-black hover:bg-gray-100 border-gray-200">
                        {importing ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                        Sync from Static
                    </Button>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openNewDialog} className="bg-black text-white hover:bg-gray-800 gap-2">
                                <Plus size={16} /> Add New
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white text-black">
                            <DialogHeader>
                                <DialogTitle>{editingId ? "Edit" : "Add"} {activeTab === "showcase" ? "Project" : "Visual Production"}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Title / Code</label>
                                    <Input
                                        placeholder="e.g. Nike Air"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        required
                                        className="bg-white border-gray-200 text-black"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Category</label>
                                    <Input
                                        placeholder="e.g. Branding & Identity"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        required={activeTab === "showcase"}
                                        className="bg-white border-gray-200 text-black"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Source URL / Path</label>
                                    <Input
                                        placeholder="/assets/..."
                                        value={formData.src}
                                        onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                                        required={!file}
                                        className="bg-white border-gray-200 text-black"
                                    />
                                    <div className="mt-2">
                                        <p className="text-xs text-gray-500 mb-1">Or upload a file (overrides URL)</p>
                                        <Input
                                            type="file"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    setFile(e.target.files[0]);
                                                }
                                            }}
                                            accept="image/*,video/*"
                                            className="bg-white border-gray-200 text-black cursor-pointer"
                                        />
                                    </div>
                                </div>
                                {activeTab === "visuals" && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Type</label>
                                        <select
                                            className="w-full border rounded-md p-2 text-sm bg-white border-gray-200 text-black"
                                            value={formData.type}
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                        >
                                            <option value="video">Video</option>
                                            <option value="image">Image</option>
                                        </select>
                                    </div>
                                )}
                                <DialogFooter>
                                    <Button type="submit" disabled={submitting} className="bg-black text-white hover:bg-gray-800">
                                        {submitting ? "Saving..." : "Save Item"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-white border text-gray-500">
                    <TabsTrigger value="showcase" className="data-[state=active]:bg-gray-100 data-[state=active]:text-black">Portfolio Showcase</TabsTrigger>
                    <TabsTrigger value="visuals" className="data-[state=active]:bg-gray-100 data-[state=active]:text-black">Visual Productions</TabsTrigger>
                </TabsList>

                <TabsContent value="showcase" className="mt-6">
                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-black">Selected Works</CardTitle>
                            <CardDescription className="text-gray-500">Main portfolio items displayed in the accordion showcase.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-black" /></div>
                            ) : projects.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    No projects found. Use 'Sync from Static' or add one manually.
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-gray-100 hover:bg-transparent">
                                            <TableHead className="w-[100px] text-gray-500">Preview</TableHead>
                                            <TableHead className="text-gray-500">Title</TableHead>
                                            <TableHead className="text-gray-500">Category</TableHead>
                                            <TableHead className="text-right text-gray-500">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {projects.map((item) => (
                                            <TableRow key={item.id} className="border-gray-100 hover:bg-gray-50">
                                                <TableCell>
                                                    <div className="relative w-16 h-10 rounded bg-gray-100 overflow-hidden border border-gray-200">
                                                        <Image
                                                            src={item.src}
                                                            alt={item.code}
                                                            fill
                                                            className="object-cover"
                                                            onError={(e) => { (e.target as HTMLImageElement).src = '/assets/placeholder.png'; }}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium text-black">{item.code}</TableCell>
                                                <TableCell className="text-gray-600">{item.category}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                                                            <Pencil size={16} />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id, "projects")} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="visuals" className="mt-6">
                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-black">Visual Productions</CardTitle>
                            <CardDescription className="text-gray-500">Videos and motion graphics items.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-black" /></div>
                            ) : visuals.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    No visual productions found. Use 'Sync from Static' or add one manually.
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-gray-100 hover:bg-transparent">
                                            <TableHead className="w-[100px] text-gray-500">Preview</TableHead>
                                            <TableHead className="text-gray-500">Title</TableHead>
                                            <TableHead className="text-gray-500">Type</TableHead>
                                            <TableHead className="text-right text-gray-500">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {visuals.map((item) => (
                                            <TableRow key={item.id} className="border-gray-100 hover:bg-gray-50">
                                                <TableCell>
                                                    <div className="relative w-16 h-10 rounded bg-gray-100 overflow-hidden flex items-center justify-center bg-gray-50 border border-gray-200">
                                                        {item.type === 'video' ? (
                                                            <div className="text-xs text-gray-500 font-mono">VIDEO</div>
                                                        ) : (
                                                            <Image
                                                                src={item.src}
                                                                alt={item.code}
                                                                fill
                                                                className="object-cover"
                                                                onError={(e) => { (e.target as HTMLImageElement).src = '/assets/placeholder.png'; }}
                                                            />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium text-black">{item.code}</TableCell>
                                                <TableCell className="capitalize text-gray-600">{item.type}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                                                            <Pencil size={16} />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id, "visual_productions")} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
