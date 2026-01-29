"use client";
import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCursor } from "@/context/cursor-context";

export function Cursor() {
    const { isHovered } = useCursor();
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
                scale: isHovered ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-16 h-16 rounded-full bg-white mix-blend-difference pointer-events-none z-[60] hidden md:block"
        />
    );
}
