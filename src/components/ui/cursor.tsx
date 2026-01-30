"use client";
import { useEffect } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useCursor } from "@/context/cursor-context";

export function Cursor() {
    const { isHovered, cursorType } = useCursor();
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveMouse = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", moveMouse);
        return () => window.removeEventListener("mousemove", moveMouse);
    }, [mouseX, mouseY]);

    return (
        <motion.div
            style={{
                x: springX,
                y: springY,
                translateX: "-50%",
                translateY: "-50%",
            }}
            animate={{
                width: cursorType === 'small' ? 8 : 100,
                height: cursorType === 'small' ? 8 : 100,
                backgroundColor: (cursorType === 'detail' || cursorType === 'video') ? 'transparent' : 'white',
                mixBlendMode: 'difference',
                scale: (cursorType === 'detail' || cursorType === 'video' || cursorType === 'small') ? 1 : (isHovered ? 0 : 1),
            }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 rounded-full pointer-events-none z-[60] hidden md:flex items-center justify-center"
        >
            <AnimatePresence mode="wait">
                {cursorType === 'detail' && (
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="w-full h-full relative"
                    >
                        <img
                            src="/assets/detailscursor.svg"
                            alt="View"
                            className="w-full h-full object-contain"
                            style={{ filter: "brightness(0) invert(1)" }}
                        />
                    </motion.div>
                )}
                {cursorType === 'video' && (
                    <motion.div
                        key="video"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="w-full h-full relative"
                    >
                        <img
                            src="/assets/infovideocursor.svg"
                            alt="Watch"
                            className="w-full h-full object-contain"
                            style={{ filter: "brightness(0) invert(1)" }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
