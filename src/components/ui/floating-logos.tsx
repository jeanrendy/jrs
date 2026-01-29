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

    // Initial random position to scatter them at start
    const initialX = useRef(Math.random() * (containerSize.width - 50));
    const initialY = useRef(Math.random() * (containerSize.height - 50));

    const wander = async () => {
        if (isDragging.current) return;

        // Pick a random target within the container
        // Margin of 50px to keep inside
        const targetX = Math.random() * (containerSize.width - 50);
        const targetY = Math.random() * (containerSize.height - 50);

        // Calculate distance to determine duration (constant speed)
        // Or just random slow duration
        const duration = 15 + Math.random() * 20; // 15-35s moves

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
            wander();
        } catch (e) {
            // Animation interrupted (e.g. by drag), ignore
        }
    };

    useEffect(() => {
        // Start wandering on mount
        // We set immediate x/y to initial to avoid jump
        controls.set({ x: initialX.current, y: initialY.current, scale: 0, opacity: 0 });

        // Appear anmiation
        controls.start({ opacity: 1, scale: 1, transition: { duration: 0.5 } }).then(() => {
            wander();
        });

        // Cleanup not strictly needed as unmount stops animation
    }, []);

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
                wander();
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
