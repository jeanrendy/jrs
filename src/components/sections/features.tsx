"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Copy, FileText, Frame, Search, Settings, Share2, Sparkles, Zap } from "lucide-react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useCursor } from "@/context/cursor-context";
import { FloatingLogos } from "@/components/ui/floating-logos";
import { TextPressure } from "@/components/ui/text-pressure";
import { useTheme } from "next-themes";
import Image from "next/image";

export function FeaturesSection() {
    const { setIsHovered } = useCursor();
    const { resolvedTheme } = useTheme();
    const containerRef = useRef<HTMLElement>(null);
    const [shouldLoad3D, setShouldLoad3D] = useState(false);
    const [isIframeLoaded, setIsIframeLoaded] = useState(false);

    // Trigger when section comes into view (-10% margin triggers it slightly early/late depending on direction, ensures "after scroll down")
    const isInView = useInView(containerRef, { once: true, margin: "-10%" });

    useEffect(() => {
        if (isInView) {
            setShouldLoad3D(true);
        }
    }, [isInView]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.9]);

    return (
        <section
            ref={containerRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#F4F2EA] dark:bg-[#030303] transition-colors duration-300"
        >
            <div className="absolute top-[5%] md:top-[8%] left-0 w-full z-30 flex flex-col items-center justify-center pointer-events-none px-4 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-black dark:text-white mb-4 tracking-tighter font-['Whyte_Inktrap',_sans-serif]">
                    My Digital Playground
                </h2>
                <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl font-light leading-relaxed">
                    This is where curiosity meets craft. Whether I'm building with AI, sculpting in 3D, or refining a brand’s visual identity, these are the tools I play with to push the boundaries of what’s possible in design.
                </p>
            </div>

            <motion.div style={{ opacity, scale }} className="w-full h-full absolute inset-0">
                {/* Background 3D Spline - Scaled Up to hide logo & Full Viewport */}
                {/* pointer-events-auto allowed for interactivity (head follow) */}
                <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                    {/* Mobile: Much smaller scale, Desktop: Original size */}
                    <div className="absolute left-1/2 top-[70%] md:top-[95%] -translate-x-1/2 -translate-y-1/2 w-[120%] h-[100%] md:w-[130%] md:h-[130%]">
                        {shouldLoad3D && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 100, filter: "blur(10px)" }}
                                animate={isIframeLoaded ? { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, scale: 0.8, y: 100, filter: "blur(10px)" }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="w-full h-full pointer-events-auto"
                            >
                                <iframe
                                    key={resolvedTheme}
                                    src={resolvedTheme === 'light'
                                        ? 'https://my.spline.design/nexbotrobotcharacterconcept-Ok137Q6eYgHC9qUNTGUiWZMB/'
                                        : 'https://my.spline.design/nexbotrobotcharacterconcept-OnPHiUOwKKYSWBcBH6TW3Eka/'}
                                    frameBorder='0'
                                    width='100%'
                                    height='100%'
                                    className="w-full h-full bg-transparent"
                                    title="3D Robot Background"
                                    onLoad={() => setIsIframeLoaded(true)}
                                />
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Auto-scrolling Logos - Mobile Only */}
                <div className="md:hidden absolute top-[25%] left-0 w-full z-20 py-8 overflow-hidden pointer-events-none">
                    <p className="text-center text-xs text-gray-600 dark:text-gray-400 uppercase tracking-widest font-medium mb-6">My Toolkit</p>
                    <div className="flex w-full">
                        <motion.div
                            className="flex items-center gap-8 whitespace-nowrap px-6"
                            animate={{ x: "-50%" }}
                            transition={{ duration: 40, ease: "linear", repeat: Infinity }}
                        >
                            {/* Tool logos duplicated for seamless loop */}
                            {[
                                "adobe illustrator.png", "aftereffect.png", "aistudio.png", "antigravity.png",
                                "blender.png", "canon.png", "canva.png", "capcut.png", "chatgpt.png",
                                "cinema4d.png", "claude.png", "clickup.png", "figma.png", "framer.png",
                                "gemini.png", "lightroom.png", "midjourney.png", "photoshop.png",
                                "premiere.png", "vercel.png", "webflow.png", "xd.png",
                                // Duplicate for seamless loop
                                "adobe illustrator.png", "aftereffect.png", "aistudio.png", "antigravity.png",
                                "blender.png", "canon.png", "canva.png", "capcut.png", "chatgpt.png",
                                "cinema4d.png", "claude.png", "clickup.png", "figma.png", "framer.png",
                                "gemini.png", "lightroom.png", "midjourney.png", "photoshop.png",
                                "premiere.png", "vercel.png", "webflow.png", "xd.png",
                            ].map((logo, i) => (
                                <div key={i} className="relative w-12 h-12 opacity-40 hover:opacity-100 transition-opacity flex-shrink-0 bg-white dark:bg-black/60 rounded-xl border border-gray-200 dark:border-white/10 backdrop-blur-sm p-2">
                                    <Image
                                        src={`/assets/minilog/${logo}`}
                                        alt="Tool logo"
                                        fill
                                        className="object-contain p-1"
                                        sizes="48px"
                                    />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Floating Logos - Desktop Only */}
                <div className="hidden md:block">
                    <FloatingLogos />
                </div>

                {/* Bottom Gradient Overlay */}
                <div className="absolute -bottom-1 left-0 w-full h-64 bg-gradient-to-t from-[#F4F2EA] dark:from-[#030303] to-transparent z-10 pointer-events-none" />



                <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10 w-full pointer-events-none">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* Left Column: Content Cards */}
                        <div className="space-y-12">


                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pointer-events-auto">
                                {features.map((feature, idx) => (
                                    <FeatureCard key={idx} feature={feature} index={idx} />
                                ))}
                            </div>
                        </div>

                        {/* Right side is intentionally empty to show the robot */}
                        <div className="hidden lg:block h-full min-h-[50vh]" />
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

const features: any[] = [];

function FeatureCard({ feature, index }: { feature: any; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur-md p-6 hover:bg-white dark:hover:bg-black/80 hover:scale-[1.02] hover:border-purple-500/20 dark:hover:border-white/20 transition-all duration-300 shadow-sm"
        >
            <div
                className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100",
                    feature.gradient
                )}
            />

            <div className="relative z-10">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white backdrop-blur-sm shadow-inner">
                    <feature.icon className="h-5 w-5" />
                </div>

                <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                    {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                </p>
            </div>
        </motion.div>
    );
}

