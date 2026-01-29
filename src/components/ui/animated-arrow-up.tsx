"use client";

import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

interface AnimatedArrowUpProps {
    className?: string;
    size?: number;
}

export function AnimatedArrowUp({ className, size = 24 }: AnimatedArrowUpProps) {
    return (
        <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -4, 0] }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            className={className}
        >
            <ArrowUp size={size} />
        </motion.div>
    );
}
