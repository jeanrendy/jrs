"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const PortfolioShowcase = () => {
    const [images, setImages] = useState<{ src: string; alt: string; code: string }[]>([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch('/api/brand-design-images');
                const data = await response.json();
                if (Array.isArray(data)) {
                    const formatted = data.map((path: string) => {
                        const filename = path.split('/').pop() || '';
                        const brandName = filename.replace(/\.[^/.]+$/, ""); // Remove extension
                        return {
                            src: path,
                            alt: brandName,
                            code: brandName
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
        <section id="work" className="flex flex-col min-h-screen w-full items-center justify-center overflow-hidden bg-background py-20">
            <div className="mb-12 w-full max-w-7xl px-5 flex flex-col items-center md:items-start text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Selected Works</h2>
                <p className="text-lg text-muted-foreground max-w-2xl">
                    A showcase of my recent brand designs and visual projects.
                </p>
            </div>
            <HoverExpand_001 className="" images={images} />
        </section>
    );
};

const HoverExpand_001 = ({
    images,
    className,
}: {
    images: { src: string; alt: string; code: string }[];
    className?: string;
}) => {
    // Set default active image to center if possible, or 0
    const [activeImage, setActiveImage] = useState<number | null>(2);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isHovered) return;
        const interval = setInterval(() => {
            setActiveImage((prev) => (prev === null || prev === images.length - 1 ? 0 : prev + 1));
        }, 3000);
        return () => clearInterval(interval);
    }, [isHovered, images.length]);

    return (
        <motion.div
            initial={{ opacity: 0, translateY: 20 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{
                duration: 0.5,
                delay: 0.1,
            }}
            className={cn("relative w-full px-2 md:px-4", className)}
        >
            <div
                className="w-full"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="flex w-full items-center justify-center gap-1 md:gap-2">
                    {images.map((image, index) => (
                        <motion.div
                            key={index}
                            className={cn(
                                "relative cursor-pointer overflow-hidden rounded-2xl md:rounded-3xl bg-neutral-900",
                                // On mobile, we might want different behavior, but for now we keep the stack
                            )}
                            initial={{ height: "600px" }} // Mobile/Default small
                            layout
                            style={{
                                flex: activeImage === index ? "0 0 1067px" : "1 1 4rem",
                            }}
                            animate={{
                                height: activeImage === index ? "600px" : "600px",
                                filter: activeImage === index ? "grayscale(0%)" : "grayscale(100%) brightness(50%)",
                            }}
                            // Responsive overrides via media queries are hard with inline motion. 
                            // We'll stick to logic provided but adjust sizes for better desktop feel

                            transition={{ type: "spring", stiffness: 200, damping: 25 }} // Natural spring animation
                            onClick={() => setActiveImage(index)}
                            onMouseEnter={() => setActiveImage(index)}
                        >
                            <AnimatePresence>
                                {activeImage === index && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
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
                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                                            {image.code}
                                        </h3>
                                        <p className="text-sm md:text-base text-gray-300">
                                            {image.alt}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.div layout className="h-full w-full">
                                <img
                                    src={image.src}
                                    className="absolute left-1/2 top-0 h-full max-w-none -translate-x-1/2 object-cover"
                                    style={{ width: "1067px" }}
                                    alt={image.alt}
                                />
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
