"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useCursor } from "@/context/cursor-context";
import { useLenis } from "lenis/react";

import Image from "next/image";

export interface CompanyLogo {
    name: string;
    src: string;
}

export function Hero({ companyLogos = [] }: { companyLogos?: CompanyLogo[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { setIsHovered } = useCursor();
    const lenis = useLenis();

    // Parallax for content
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section
            ref={containerRef}
            className="relative w-full min-h-[100dvh] lg:h-[100dvh] flex flex-col justify-between pt-20 overflow-x-hidden lg:overflow-hidden bg-background"
        >
            {/* Dashed Center Fade Grid Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* SVG Dashed Grid Pattern */}
                <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="dashed-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                            <path
                                d="M 60 0 L 60 60 M 0 60 L 60 60"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
                                strokeDasharray="4 6"
                                opacity="0.8"
                            />
                        </pattern>
                        <radialGradient id="fade-gradient">
                            <stop offset="60%" stopColor="white" stopOpacity="1" />
                            <stop offset="100%" stopColor="white" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dashed-grid)" mask="url(#fade-mask)" />
                    <mask id="fade-mask">
                        <ellipse cx="50%" cy="50%" rx="35%" ry="35%" fill="url(#fade-gradient)" />
                    </mask>
                </svg>
            </div>

            {/* Right Column: Profile Image - Positioned Absolutely to Right Edge */}
            <motion.div
                style={{ y, opacity }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute right-[-35vw] md:right-[-20vw] lg:right-[-10vw] bottom-0 top-[150px] lg:top-[300px] w-[160vw] md:w-[120vw] lg:w-[100vw] block z-0 pointer-events-none opacity-100 lg:opacity-100"
            >
                <div className="relative w-full h-full">
                    <Image
                        src="/assets/prof2.png"
                        alt="Jean Rendy Profile"
                        fill
                        className="object-contain object-right-bottom drop-shadow-2xl scale-130 origin-bottom-right"
                        priority
                        sizes="50vw"
                    />
                </div>
            </motion.div>

            <div className="container relative flex-1 flex flex-col justify-center px-6 mx-auto pt-24 md:pt-0 pb-32">
                <div
                    className="flex flex-col items-start justify-center text-left md:items-center md:text-center w-full"
                    suppressHydrationWarning
                >
                    {/* Availability Badge - Outside mix-blend-difference */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="inline-flex items-center gap-2 bg-gray-100/80 dark:bg-white/10 backdrop-blur-sm border border-gray-300/50 dark:border-white/20 rounded-full px-4 py-2 mb-6 w-fit"
                    >
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Limited Engagement | Only 1 Slot Remaining</span>
                    </motion.div>

                    <motion.div
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.15,
                                    delayChildren: 0.2
                                }
                            }
                        }}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6 w-full max-w-5xl pointer-events-none mix-blend-difference text-white"
                    >
                        <motion.h1
                            variants={{
                                hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
                                visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: "easeOut" } }
                            }}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-left md:text-center md:mx-auto"
                        >
                            Bridging <span className="font-serif italic font-medium">The Gap</span> Between <br className="hidden md:block" />
                            <span className="font-serif italic font-medium">Aesthetic Vision</span> And <br className="hidden md:block" />
                            <span className="font-serif italic font-medium">Functional Execution.</span>
                        </motion.h1>

                        <motion.p
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                            }}
                            className="text-base md:text-lg max-w-2xl md:mx-auto leading-relaxed"
                        >
                            Hybrid Designer & Creative Director specializing in UI/UX, branding, and videography, enhanced by a technical foundation in software development and prompt engineering.
                        </motion.p>
                    </motion.div>

                    {/* Buttons - Normal Rendering (No Blend Mode) */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, scale: 0.95 },
                            visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.6 } }
                        }}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-wrap gap-4 justify-start md:justify-center pt-10 pointer-events-auto"
                    >
                        {/* Buttons kept for functionality, assuming style might need update later if requested */}
                        <Magnetic onHoverChange={setIsHovered}>
                            <Button size="lg" variant="outline" className="rounded-full h-12 px-8 text-base hover:bg-secondary">
                                View Selected Work
                            </Button>
                        </Magnetic>
                        <Magnetic onHoverChange={setIsHovered}>
                            <Button
                                size="lg"
                                className="rounded-full h-12 px-8 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
                                onClick={() => lenis?.scrollTo(document.body.scrollHeight, { duration: 3 })}
                            >
                                Let's Talk
                            </Button>
                        </Magnetic>
                    </motion.div>
                </div>
            </div>




            {/* Autoscrolling Logos - Positioned at Bottom */}
            <motion.div
                style={{ opacity, y }}
                className="relative lg:absolute lg:bottom-0 left-0 w-full z-20 py-8 bg-background/0 backdrop-blur-[2px] overflow-hidden"
                suppressHydrationWarning
            >
                <p className="text-center text-xs text-muted-foreground/60 uppercase tracking-widest font-medium mb-6">Collaborations that delivered.</p>
                <div className="flex w-full overflow-hidden">
                    <motion.div
                        className="flex items-center gap-16 whitespace-nowrap"
                        animate={{ x: "-50%" }}
                        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
                    >
                        {/* Dynamic Company Logos - Duplicated exactly twice for seamless 50% loop */}
                        {[...companyLogos, ...companyLogos].map((logo, i) => (
                            <div key={`${logo.src}-${i}`} className="relative w-32 h-10 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default flex items-center justify-center mx-4 invert dark:invert-0 flex-shrink-0">
                                <Image
                                    src={logo.src}
                                    alt={logo.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>

        </section >
    );
}

function Magnetic({ children, onHoverChange }: { children: React.ReactNode; onHoverChange: (hover: boolean) => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = e;
        if (!ref.current) return;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        x.set(middleX * 0.35); // Magnetic strength
        y.set(middleY * 0.35);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        onHoverChange(false);
    };

    const handleMouseEnter = () => {
        onHoverChange(true);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            style={{ x: springX, y: springY }}
        >
            {children}
        </motion.div>
    );
}
