"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, deleteDoc, doc, writeBatch, Timestamp, orderBy, query, Firestore } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Trash2, RefreshCw, Pencil, Briefcase } from "lucide-react";

import { STATIC_EXPERIENCES, type Experience } from "@/data/experiences";

export default function AdminExperience() {
    const router = useRouter();
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [importing, setImporting] = useState(false);

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        if (!db) return;
        setLoading(true);
        try {
            const q = query(collection(db as Firestore, "experiences"));
            const snapshot = await getDocs(q);
            const data: Experience[] = [];
            snapshot.forEach((doc) => {
                // IMPORTANT: Spread doc.data() FIRST, then overwrite id with doc.id
                // This prevents internal data 'id' field from overriding the actual Firestore Document ID
                data.push({ ...doc.data(), id: doc.id } as Experience);
            });
            setExperiences(data);
        } catch (error) {
            console.error("Error fetching experiences:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id: string) => {
        router.push(`/admin/experience/editor?id=${id}`);
    };

    const handleCreateNew = () => {
        router.push(`/admin/experience/editor?id=new`);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this experience?")) return;
        if (!db) return;
        try {
            await deleteDoc(doc(db as Firestore, "experiences", id));
            setExperiences(prev => prev.filter(e => e.id !== id));
        } catch (error) {
            console.error("Error deleting experience:", error);
        }
    };

    const importFromStatic = async () => {
        if (!db) return;
        if (!confirm("This will import static experience data into Firestore. Continue?")) return;
        setImporting(true);
        const batch = writeBatch(db as Firestore);

        try {
            STATIC_EXPERIENCES.forEach((exp, index) => {
                const docRef = doc(collection(db as Firestore, "experiences"));
                // Destructure id out to prevent saving it to the document data
                // We want Firestore IDs, not the static IDs '1', '2', etc. inside the data blob
                const { id: _, ...expData } = exp;

                batch.set(docRef, {
                    ...expData,
                    order: index,
                    createdAt: Timestamp.now()
                });
            });

            await batch.commit();
            alert("Experiences imported successfully.");
            fetchExperiences();
        } catch (error) {
            console.error("Error importing:", error);
            alert("Failed to import.");
        } finally {
            setImporting(false);
        }
    };

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen text-gray-900 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Work Experience</h1>
                    <p className="text-gray-500">Manage your professional career history.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={importFromStatic} disabled={importing} className="gap-2 bg-white text-black hover:bg-gray-100 border-gray-200">
                        {importing ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                        Sync Initial Data
                    </Button>
                    <Button onClick={handleCreateNew} className="bg-black text-white hover:bg-gray-800 gap-2">
                        <Plus size={16} /> Add New
                    </Button>
                </div>
            </div>

            <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-black">Experience List</CardTitle>
                    <CardDescription className="text-gray-500">Your career journey.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-black" /></div>
                    ) : experiences.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No experiences found. Click 'Sync Initial Data' or add new.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-gray-100 hover:bg-transparent">
                                    <TableHead className="text-gray-500">Title</TableHead>
                                    <TableHead className="text-gray-500">Company</TableHead>
                                    <TableHead className="text-gray-500">Period</TableHead>
                                    <TableHead className="text-right text-gray-500">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {experiences
                                    // Sort by order ascending
                                    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
                                    .map((item) => (
                                        <TableRow key={item.id} className="border-gray-100 hover:bg-gray-50">
                                            <TableCell className="font-medium text-black">
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="w-4 h-4 text-gray-400" />
                                                    {item.title}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-600">{item.company}</TableCell>
                                            <TableCell className="text-gray-500 text-sm">
                                                {item.startDate} - {item.endDate || "Present"}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item.id)} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                                                        <Pencil size={16} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
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
        </div>
    );
}
