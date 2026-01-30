"use client";

import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const logos = [
    "adobe illustrator.png", "aftereffect.png", "aistudio.png", "antigravity.png",
    "blender.png", "canon.png", "canva.png", "capcut.png", "chatgpt.png",
    "cinema4d.png", "claude.png", "clickup.png", "cubase.png", "davinci.png",
    "figma.png", "framer.png", "gemini.png", "lightroom.png", "mac.png",
    "midjourney.png", "miro.png", "nanobanana.png", "nuendo.png",
    "photoshop.png", "premiere.png", "resolume.png", "silverstack.png",
    "slack.png", "sony.png", "vercel.png", "webflow.png", "win.png", "xd.png"
];

export function FloatingLogos() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!containerRef.current) return;

        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            {dimensions.width > 0 && logos.map((logo, i) => (
                <FloatingLogo
                    key={logo}
                    src={`/assets/minilog/${logo}`}
                    index={i}
                    total={logos.length}
                    containerRef={containerRef}
                    containerSize={dimensions}
                />
            ))}
        </div>
    );
}

function FloatingLogo({
    src,
    index,
    total,
    containerRef,
    containerSize
}: {
    src: string,
    index: number,
    total: number,
    containerRef: React.RefObject<HTMLDivElement | null>,
    containerSize: { width: number, height: number }
}) {
    const controls = useAnimation();
    const isDragging = useRef(false);

    // Use refs for value storage, but initialize in effect to assume purity
    const initialPos = useRef({ x: 0, y: 0 });
    const isInitialized = useRef(false);

    // Move wander to a ref to handle recursion/scope issues cleanly or just use useCallback carefully
    // Since it calls itself, we can use a ref to hold the function or just rely on closure if carefully done.
    // However, simplest here is to define it at component level with useCallback.

    // We need a stable reference to call from onDragEnd
    const wanderRef = useRef<() => void>(() => { });

    const wander = async () => {
        if (isDragging.current) return;

        // Pick a random target within the container
        const targetX = Math.random() * (containerSize.width - 50);
        const targetY = Math.random() * (containerSize.height - 50);

        const duration = 15 + Math.random() * 20;

        try {
            await controls.start({
                x: targetX,
                y: targetY,
                rotate: (Math.random() - 0.5) * 60,
                transition: {
                    duration: duration,
                    ease: "linear",
                }
            });

            // Loop if not interrupted
            wanderRef.current();
        } catch (e) {
            // Animation interrupted
        }
    };

    // Update ref so we can call it recursively and externally
    useEffect(() => {
        wanderRef.current = wander;
    });

    useEffect(() => {
        if (!isInitialized.current) {
            initialPos.current = {
                x: Math.random() * (containerSize.width - 50),
                y: Math.random() * (containerSize.height - 50)
            };
            isInitialized.current = true;
        }

        // Start wandering
        controls.set({ x: initialPos.current.x, y: initialPos.current.y, scale: 0, opacity: 0 });
        controls.start({ opacity: 1, scale: 1, transition: { duration: 0.5 } }).then(() => {
            wanderRef.current();
        });
    }, [containerSize.width, containerSize.height, controls]); // Re-run if size changes? Maybe.

    return (
        <motion.div
            animate={controls}
            drag
            dragConstraints={containerRef}
            dragElastic={0.1}
            dragMomentum={false} // Stop immediately on release
            onDragStart={() => {
                isDragging.current = true;
                // controls.stop(); // Implicitly handled by drag taking over
            }}
            onDragEnd={() => {
                isDragging.current = false;
                // Resume wandering from new position
                wanderRef.current();
            }}
            whileHover={{ scale: 1.2, zIndex: 60, cursor: "grab" }}
            whileDrag={{ scale: 1.2, zIndex: 100, cursor: "grabbing" }}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "60px",
                height: "60px",
                zIndex: 20
            }}
            className="pointer-events-auto bg-white dark:bg-black/80 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 backdrop-blur-sm flex items-center justify-center p-2"
        >
            <div className="relative w-full h-full">
                <Image
                    src={src}
                    alt="Logo"
                    fill
                    className="object-contain pointer-events-none"
                    sizes="40px"
                    priority={index < 10} // Prioritize first few images
                />
            </div>
        </motion.div>
    );
}
