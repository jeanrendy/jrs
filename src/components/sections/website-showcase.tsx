"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, Globe, Layers, ArrowRight } from "lucide-react";
import { useCursor } from "@/context/cursor-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { STATIC_WEBSITES, type Website } from "@/data/websites";
import { collection, getDocs, query, orderBy, Firestore } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PinContainer } from "@/components/ui/3d-pin";

export function WebsiteShowcase() {
    const { setCursorType } = useCursor();
    const [websites, setWebsites] = useState<Website[]>(STATIC_WEBSITES);
    const [visibleCount, setVisibleCount] = useState(6);
    const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);

    useEffect(() => {
        const fetchWebsites = async () => {
            if (!db) return;
            try {
                const q = query(collection(db as Firestore, "websites"), orderBy("order", "asc"));
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    const data: Website[] = [];
                    snapshot.forEach((doc) => {
                        data.push({ ...doc.data(), id: doc.id } as Website);
                    });
                    setWebsites(data);
                }
            } catch (error) {
                console.error("Error fetching websites:", error);
            }
        };

        fetchWebsites();
    }, []);

    const handleLoadMore = () => {
        setVisibleCount((prev) => Math.min(prev + 3, websites.length));
    };

    const handleCardClick = (site: Website) => {
        setSelectedWebsite(site);
        setCursorType('default');
    };

    return (
        <section className="relative py-24 md:py-32 bg-background overflow-hidden" id="websites">
            <div className="container mx-auto px-6 md:px-8 max-w-7xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
                >
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Websites</h2>
                        <p className="text-muted-foreground text-lg max-w-xl">
                            Live web projects and applications demonstrating full-stack capabilities and interactive design.
                        </p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {websites.slice(0, visibleCount).map((site, index) => (
                        <motion.div
                            key={site.id || site.url || index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                                duration: 0.8,
                                delay: index * 0.2, // Staggered delay (0.2s each)
                                ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                            className="h-[35rem] w-full flex items-center justify-center -mt-10 md:-mt-0"
                        >
                            <PinContainer
                                title={new URL(site.url).toString()}
                                href={site.url}
                                className="w-[80vw] md:w-[24rem] overflow-hidden"
                                containerClassName="cursor-none"
                                onClick={() => handleCardClick(site)}
                            >
                                <div
                                    className="flex flex-col h-full w-full bg-card group/card"
                                    onMouseEnter={() => setCursorType('detail')}
                                    onMouseLeave={() => setCursorType('default')}
                                >
                                    {/* Browser Toolbar Mockup */}
                                    <div className="h-9 bg-muted/50 border-b border-border/50 flex items-center px-4 gap-2 select-none">
                                        <div className="flex gap-1.5 opacity-50 group-hover/card:opacity-100 transition-opacity">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                        </div>
                                        <div className="ml-2 flex-1 h-6 bg-background/80 rounded-md text-[10px] text-muted-foreground flex items-center px-3 truncate opacity-50 group-hover/card:opacity-80 transition-opacity font-mono">
                                            {new URL(site.url).hostname}
                                        </div>
                                    </div>

                                    {/* Thumbnail Preview */}
                                    <div className="aspect-[4/3] w-full relative bg-white overflow-hidden flex-1">
                                        <iframe
                                            src={site.url}
                                            title={site.title}
                                            className="w-[200%] h-[200%] absolute top-0 left-0 border-0 transform scale-50 origin-top-left pointer-events-none select-none grayscale group-hover/card:grayscale-0 transition-all duration-500 will-change-transform"
                                            scrolling="no"
                                            loading="lazy"
                                        />
                                        {/* Overlay for click interaction */}
                                        <div className="absolute inset-0 bg-transparent z-10" />
                                        <div className="absolute inset-0 bg-black/5 group-hover/card:bg-transparent transition-colors duration-300 pointer-events-none" />
                                    </div>

                                    <div className="p-5 border-t border-border/50 bg-card z-20 relative">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-lg leading-tight">{site.title}</h3>
                                            <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover/card:opacity-100 transition-opacity" />
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-1">{site.description}</p>

                                        {/* Micro Tech Stack */}
                                        <div className="flex flex-wrap gap-1 mt-3 opacity-60">
                                            {site.techStack.slice(0, 3).map(tech => (
                                                <span key={tech} className="text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </PinContainer>
                        </motion.div>
                    ))}
                </div>

                {/* Load More Button */}
                {visibleCount < websites.length && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="flex justify-center mt-12"
                    >
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handleLoadMore}
                            className="bg-transparent border-border hover:bg-muted text-foreground gap-2 rounded-full px-8"
                        >
                            Load More Websites <ArrowRight className="w-4 h-4" />
                        </Button>
                    </motion.div>
                )}
            </div>

            {/* Detailed Modal */}
            <AnimatePresence>
                {selectedWebsite && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" style={{ zIndex: 100 }}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setSelectedWebsite(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                            className="relative w-full max-w-5xl bg-background rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedWebsite(null)}
                                className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Left: Interactive Preview */}
                            <div className="w-full md:w-2/3 bg-neutral-100 dark:bg-neutral-900 border-b md:border-b-0 md:border-r border-border relative h-[40vh] md:h-auto">
                                <iframe
                                    src={selectedWebsite.url}
                                    title={selectedWebsite.title}
                                    className="w-full h-full border-0"
                                    loading="lazy"
                                />
                                <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur text-xs p-2 rounded text-center opacity-0 hover:opacity-100 transition-opacity">
                                    If preview doesn't load, use the external link.
                                </div>
                            </div>

                            {/* Right: Details */}
                            <div className="w-full md:w-1/3 p-8 flex flex-col overflow-y-auto bg-background">
                                <div className="mb-8">
                                    <h3 className="text-3xl font-bold mb-2">{selectedWebsite.title}</h3>
                                    <a
                                        href={selectedWebsite.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
                                    >
                                        <Globe className="w-3.5 h-3.5" /> {new URL(selectedWebsite.url).hostname}
                                    </a>
                                </div>

                                <div className="space-y-6 flex-1">
                                    <div>
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                                            <Layers className="w-4 h-4" /> Tech Stack
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedWebsite.techStack.map(tech => (
                                                <span key={tech} className="px-3 py-1 bg-muted rounded-full text-sm font-medium border border-border">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Description</h4>
                                        <p className="text-foreground leading-relaxed">
                                            {selectedWebsite.description} - A responsive and interactive web experience designed to meet specific user needs and business goals.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Year</h4>
                                        <p className="font-mono">{selectedWebsite.year}</p>
                                    </div>
                                </div>

                                <div className="pt-8 mt-8 border-t border-border">
                                    <a
                                        href={selectedWebsite.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button className="w-full gap-2 rounded-full" size="lg">
                                            Visit Live Site <ExternalLink className="w-4 h-4" />
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
