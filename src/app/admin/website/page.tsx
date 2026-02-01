"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, deleteDoc, doc, writeBatch, Timestamp, query, orderBy, Firestore } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Plus, Trash2, RefreshCw, Pencil, Globe, GripVertical, Save } from "lucide-react";
import { STATIC_WEBSITES, type Website } from "@/data/websites";
import { Reorder, useDragControls } from "framer-motion";

export default function AdminWebsite() {
    const router = useRouter();
    const [websites, setWebsites] = useState<Website[]>([]);
    const [loading, setLoading] = useState(true);
    const [importing, setImporting] = useState(false);
    const [savingOrder, setSavingOrder] = useState(false);
    const [hasReordered, setHasReordered] = useState(false);

    useEffect(() => {
        fetchWebsites();
    }, []);

    const fetchWebsites = async () => {
        if (!db) return;
        setLoading(true);
        try {
            const q = query(collection(db as Firestore, "websites"), orderBy("order", "asc"));
            const snapshot = await getDocs(q);
            const data: Website[] = [];
            snapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() } as Website);
            });
            setWebsites(data);
        } catch (error) {
            console.error("Error fetching websites:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id: string) => {
        router.push(`/admin/website/editor?id=${id}`);
    };

    const handleCreateNew = () => {
        router.push(`/admin/website/editor?id=new`);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this website?")) return;
        if (!db) return;
        try {
            await deleteDoc(doc(db as Firestore, "websites", id));
            setWebsites(prev => prev.filter(e => e.id !== id));
        } catch (error) {
            console.error("Error deleting website:", error);
            alert("Failed to delete.");
        }
    };

    const handleReorder = (newOrder: Website[]) => {
        setWebsites(newOrder);
        setHasReordered(true);
    };

    const saveOrder = async () => {
        if (!db) return;
        setSavingOrder(true);
        try {
            const batch = writeBatch(db as Firestore);
            websites.forEach((site, index) => {
                if (site.id) {
                    const docRef = doc(db as Firestore, "websites", site.id);
                    batch.update(docRef, { order: index });
                }
            });
            await batch.commit();
            setHasReordered(false);
            // alert("Order saved successfully.");
        } catch (error) {
            console.error("Error saving order:", error);
            alert("Failed to save order.");
        } finally {
            setSavingOrder(false);
        }
    };

    const importFromStatic = async () => {
        if (!db) return;
        if (!confirm("This will import static website data into Firestore. Continue?")) return;
        setImporting(true);
        const batch = writeBatch(db as Firestore);

        try {
            STATIC_WEBSITES.forEach((site, index) => {
                const docRef = doc(collection(db as Firestore, "websites"));
                batch.set(docRef, {
                    ...site,
                    order: index,
                    createdAt: Timestamp.now()
                });
            });

            await batch.commit();
            fetchWebsites();
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
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Websites</h1>
                    <p className="text-gray-500">Manage your website showcase and arrangement.</p>
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

            {hasReordered && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-center justify-between sticky top-4 z-40 shadow-sm">
                    <p className="text-blue-700 text-sm font-medium">You have changed the order. Don't forget to save.</p>
                    <Button size="sm" onClick={saveOrder} disabled={savingOrder} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                        {savingOrder ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                        Save Order
                    </Button>
                </div>
            )}

            <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-black">Website List</CardTitle>
                    <CardDescription className="text-gray-500">Drag items to reorder.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-black" /></div>
                    ) : websites.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No websites found. Click 'Sync Initial Data' or add new.
                        </div>
                    ) : (
                        <Reorder.Group axis="y" values={websites} onReorder={handleReorder} className="space-y-3">
                            {websites.map((item) => (
                                <Reorder.Item key={item.id} value={item}>
                                    <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-lg hover:shadow-md transition-shadow group cursor-grab active:cursor-grabbing">
                                        <div className="text-gray-300 group-hover:text-gray-500 transition-colors">
                                            <GripVertical size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                                                    <Globe size={10} /> {new URL(item.url).hostname}
                                                </a>
                                            </div>
                                            <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                                        </div>
                                        <div className="flex items-center gap-2 pt-1">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(item.id!)} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                                                <Pencil size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id!)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
