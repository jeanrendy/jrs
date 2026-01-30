"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useEffect, useRef, useId } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import Image from "next/image";
import { useCursor, CursorType } from "@/context/cursor-context";

export const PortfolioShowcase = () => {
    const [images, setImages] = useState<{ src: string; alt: string; code: string; category: string }[]>([]);
    const { setCursorType } = useCursor();

    useEffect(() => {
        const fetchImages = async () => {
            try {
                // Try fetching from Firestore first
                let firestoreProjects: { src: string; alt: string; code: string; category: string }[] = [];
                // Dynamic import to avoid SSR issues if firebase isn't fully ready
                const { db } = await import("@/lib/firebase");
                const { collection, getDocs, query, orderBy } = await import("firebase/firestore");

                if (db) {
                    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        firestoreProjects = querySnapshot.docs.map(doc => {
                            const data = doc.data();
                            return {
                                src: data.src,
                                alt: data.code, // Use code/title as alt
                                code: data.code,
                                category: data.category
                            };
                        });
                    }
                }

                if (firestoreProjects.length > 0) {
                    setImages(firestoreProjects);
                    return;
                }

                // Fallback to local files API
                const response = await fetch('/api/brand-design-images');
                const data = await response.json();
                if (Array.isArray(data)) {
                    const formatted = data.map((path: string) => {
                        const filename = path.split('/').pop() || '';
                        const brandName = filename.replace(/\.[^/.]+$/, ""); // Remove extension

                        let category = "Branding & Visual Identity";
                        if (brandName === "Atelier Jolie") category = "Art, Fashion & Community";
                        if (brandName === "Gridhaus") category = "Sports & Lifestyle";

                        return {
                            src: path,
                            alt: brandName,
                            code: brandName,
                            category: category
                        };
                    });
                    setImages(formatted);
                }
            } catch (error) {
                console.error("Error fetching portfolio images:", error);
            }
        };

        fetchImages();
    }, []);

    if (images.length === 0) return null;

    return (
        <section
            id="work"
            className="flex flex-col min-h-screen w-full items-center justify-center overflow-hidden bg-background py-20"
            onMouseEnter={() => setCursorType('small')}
            onMouseLeave={() => setCursorType('default')}
        >
            <div className="mb-12 w-full max-w-7xl px-5 flex flex-col items-center md:items-start text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Selected Works</h2>
                <p className="text-lg text-muted-foreground max-w-2xl">
                    A showcase of my recent brand designs and visual projects.
                </p>
            </div>
            <HoverExpand_001 className="" images={images} setCursorType={setCursorType} />
        </section>
    );
};

const ProjectSlider = ({ images }: { images: string[] }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [images.length]);

    const handleDragEnd = (e: any, { offset, velocity }: any) => {
        const swipe = Math.abs(offset.x) * velocity.x;
        if (swipe < -100) {
            setIndex((prev) => (prev + 1) % images.length);
        } else if (swipe > 100) {
            setIndex((prev) => (prev - 1 + images.length) % images.length);
        }
    };

    return (
        <div className="relative h-full w-full overflow-hidden bg-black group">
            <motion.div
                className="flex h-full w-full cursor-grab active:cursor-grabbing"
                animate={{ x: `-${index * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
            >
                {images.map((src, i) => (
                    <div key={i} className="relative h-full w-full flex-shrink-0">
                        <Image
                            fill
                            src={src}
                            alt={`Slide ${i}`}
                            className="object-cover pointer-events-none opacity-80"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                    </div>
                ))}
            </motion.div>

            {/* Pagination Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300",
                            index === i ? "bg-[#CCFF00] w-6" : "bg-white/50 hover:bg-white"
                        )}
                    />
                ))}
            </div>
        </div>
    );
};

const HoverExpand_001 = ({
    images,
    className,
    setCursorType
}: {
    images: { src: string; alt: string; code: string; category: string }[];
    className?: string;
    setCursorType: (type: CursorType) => void;
}) => {
    const [activeImage, setActiveImage] = useState<number | null>(2);
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [selectedProject, setSelectedProject] = useState<{ src: string; alt: string; code: string; category: string } | null>(null);
    const ref = useRef<HTMLDivElement>(null);
    const id = useId();

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        if (isHovered || isMobile || selectedProject) return;
        const interval = setInterval(() => {
            setActiveImage((prev) => (prev === null || prev === images.length - 1 ? 0 : prev + 1));
        }, 3000);
        return () => clearInterval(interval);
    }, [isHovered, images.length, isMobile, selectedProject]);

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setSelectedProject(null);
            }
        }

        if (selectedProject) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [selectedProject]);

    useOutsideClick(ref, () => {
        setSelectedProject(null);
        setCursorType('default');
    });

    const closeModal = () => {
        setSelectedProject(null);
        setCursorType('default');
    };

    return (
        <>
            {/* Expanded Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <div className="fixed inset-0 grid place-items-center z-[100] p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm h-full w-full z-0"
                            onClick={closeModal}
                        />
                        <motion.div
                            layoutId={`card-${selectedProject.code}-${id}`}
                            ref={ref}
                            className="w-full max-w-[90vw] md:max-w-[800px] h-[85vh] md:h-fit md:max-h-[90vh] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden shadow-2xl z-10 relative cursor-none"
                        >
                            <button
                                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full z-50 backdrop-blur-md transition-colors cursor-none"
                                onClick={closeModal}
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="relative h-64 md:h-96 w-full flex-shrink-0 bg-black">
                                <motion.div layoutId={`image-${selectedProject.code}-${id}`} className="h-full w-full relative">
                                    <ProjectSlider images={[selectedProject.src, '/assets/phland.png', '/assets/phland.png', '/assets/phland.png']} />
                                </motion.div>
                            </div>

                            <div className="flex flex-col p-6 md:p-8 overflow-y-auto bg-[#111111] text-white h-full">
                                {/* Header Row */}
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
                                    <div>
                                        <p className="text-sm font-medium text-gray-400 mb-1">2023</p>
                                        <motion.h3
                                            layoutId={`title-${selectedProject.code}-${id}`}
                                            className="text-3xl md:text-4xl font-bold text-white mb-1"
                                        >
                                            {selectedProject.code}
                                        </motion.h3>
                                        <motion.p
                                            layoutId={`description-${selectedProject.alt}-${id}`}
                                            className="text-lg text-gray-400 italic"
                                        >
                                            {selectedProject.category}
                                        </motion.p>
                                    </div>

                                    <div className="flex gap-3">
                                        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium cursor-none">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Case Study
                                        </button>
                                        <a
                                            href={selectedProject.code === 'Atelier Jolie' ? "https://www.atelierjolie.com" : "#"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#CCFF00] text-black hover:bg-[#b3e600] transition-colors text-sm font-medium cursor-none"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            View Live
                                        </a>
                                    </div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-3">Project Insight</h4>
                                        <p className="text-gray-400 leading-relaxed">
                                            For {selectedProject.code}, I took a deep dive into creating a visual identity that truly reflects the core values of the brand while keeping things fresh and modern. The goal wasn't just to design a logo, but to build a complete visual language that feels both sophisticated and cutting-edge.
                                        </p>
                                        <p className="text-gray-400 leading-relaxed mt-4">
                                            From the initial sketches to the high-fidelity renders, every pixel was crafted with intention to ensure the brand's identity was both powerful and cohesive.
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-3 mt-8">
                                        {["Branding", "Website", "Art Direction", "Motion"].map((tag) => (
                                            <span key={tag} className="px-5 py-2 rounded-full bg-white/5 text-gray-300 text-sm border border-white/10">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Accordion Layout */}
            <motion.div
                initial={{ opacity: 0, translateY: 20 }}
                whileInView={{ opacity: 1, translateY: 0 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={cn("relative w-full px-2 md:px-4 hidden md:block", className)}
            >
                <div
                    className="w-full"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => { setIsHovered(false); setCursorType('small'); }}
                >
                    <div className="flex w-full items-center justify-center gap-1 md:gap-2">
                        {images.map((image, index) => (
                            <motion.div
                                key={index}
                                layoutId={`card-${image.code}-${id}`}
                                className="relative cursor-none overflow-hidden rounded-2xl md:rounded-3xl bg-neutral-900"
                                initial={{ height: "600px" }}
                                layout
                                style={{
                                    flex: activeImage === index ? "0 0 1067px" : "1 1 4rem",
                                }}
                                animate={{
                                    height: "600px",
                                    filter: activeImage === index ? "grayscale(0%)" : "grayscale(100%) brightness(50%)",
                                }}
                                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                                onClick={() => { setSelectedProject(image); setCursorType('default'); }}
                                onMouseEnter={() => { setActiveImage(index); setCursorType('detail'); }}
                            >
                                <AnimatePresence>
                                    {activeImage === index && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"
                                        />
                                    )}
                                </AnimatePresence>

                                <AnimatePresence>
                                    {activeImage === index && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.3, delay: 0.1 }}
                                            className="absolute bottom-0 left-0 z-20 flex w-full flex-col justify-end p-6 md:p-8"
                                        >
                                            <motion.h3
                                                layoutId={`title-${image.code}-${id}`}
                                                className="text-2xl md:text-3xl font-bold text-white mb-1"
                                            >
                                                {image.code}
                                            </motion.h3>
                                            <motion.p
                                                layoutId={`description-${image.alt}-${id}`}
                                                className="text-sm md:text-base text-gray-300"
                                            >
                                                {image.category}
                                            </motion.p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.div layoutId={`image-${image.code}-${id}`} className="h-full w-full">
                                    <Image
                                        fill
                                        src={image.src}
                                        className="object-cover w-full h-full"
                                        alt={image.alt}
                                    />
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Mobile Stack Layout */}
            {isMobile && <MobileCardStack images={images} onSelect={setSelectedProject} id={id} />}
        </>
    );
};

const MobileCardStack = ({ images, onSelect, id }: { images: { src: string; alt: string; code: string; category: string }[]; onSelect: (img: any) => void; id: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDragEnd = (e: any, { offset }: any) => {
        const swipeThreshold = 50;
        if (Math.abs(offset.x) > swipeThreshold) {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }
    };

    const visibleCards = 3;
    const cards = [];
    for (let i = 0; i < visibleCards; i++) {
        const index = (currentIndex + i) % images.length;
        cards.push({ ...images[index], stackIndex: i });
    }

    return (
        <div className="relative w-full h-[60vh] flex items-center justify-center max-w-sm mx-auto md:hidden">
            <AnimatePresence initial={false}>
                {cards.reverse().map((image) => {
                    const isTop = image.stackIndex === 0;
                    return (
                        <motion.div
                            key={`${image.src}-${image.stackIndex}-${currentIndex}`}
                            layoutId={isTop ? `card-${image.code}-${id}` : undefined}
                            className="absolute top-0 left-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-neutral-900 border border-white/10"
                            initial={{
                                scale: 1 - image.stackIndex * 0.05,
                                y: image.stackIndex * 20,
                                opacity: 1 - image.stackIndex * 0.2,
                                zIndex: visibleCards - image.stackIndex
                            }}
                            animate={{
                                scale: 1 - image.stackIndex * 0.05,
                                y: image.stackIndex * 20,
                                opacity: 1 - image.stackIndex * 0.2,
                                zIndex: visibleCards - image.stackIndex
                            }}
                            drag={isTop ? "x" : false}
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={isTop ? handleDragEnd : undefined}
                            whileDrag={{ scale: 1.05, rotate: 2 }}
                            exit={{ x: 300, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            onClick={() => isTop && onSelect(image)}
                        >
                            <motion.div layoutId={isTop ? `image-${image.code}-${id}` : undefined} className="w-full h-full relative">
                                <Image
                                    fill
                                    src={image.src}
                                    className="object-cover w-full h-full pointer-events-none"
                                    alt={image.alt}
                                />
                            </motion.div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 w-full p-6">
                                <motion.h3 layoutId={isTop ? `title-${image.code}-${id}` : undefined} className="text-2xl font-bold text-white shadow-black drop-shadow-lg">{image.code}</motion.h3>
                                <motion.p layoutId={isTop ? `description-${image.alt}-${id}` : undefined} className="text-gray-300 text-sm shadow-black drop-shadow-md">{image.category}</motion.p>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};
