"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { BarChart3, Palette, FileText, Workflow, Users, Code2, Brain, Layout, Sparkles, Check } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

const services = [
    {
        icon: Palette,
        title: "Creative Direction",
        description: "Vision alignment",
        mockup: "task-list"
    },
    {
        icon: Palette,
        title: "UI/UX Strategy",
        description: "Human-centered design",
        mockup: "ui-ux"
    },
    {
        icon: BarChart3,
        title: "Brand & Graphic Design",
        description: "Visual identity systems",
        mockup: "card-stack"
    },
    {
        icon: FileText,
        title: "Visual Production",
        description: "Photography & videography",
        mockup: "visual-slider"
    },
    {
        icon: Workflow,
        title: "AI Web Designer",
        description: "Generative UI & smart UX",
        mockup: "workflow"
    },
    {
        icon: Users,
        title: "Digital Imaging Tech",
        description: "Color precision & technical integrity",
        mockup: "team"
    },
];

const skillsRow1 = [
    "Branding & Identity",
    "Logo Design",
    "Packaging Design",
    "Stationery Design",
    "Web Design",
    "UI/UX Design",
    "Mobile App Design",
    "Motion Graphics",
    "Visual Storytelling",
    "Creative Direction",
    "Art Direction",
    "Design Systems",
    "Typography",
    "Brand Strategy",
    "Iconography",
    "Product Photography",
    "Commercial Videography",
    "Video Editing",
    "Social Media Content",
    "Digital Advertising",
    "Print Production",
    "Layout Design",
    "Illustration",
    "Key Visuals",
    "Prompt Engineering",
    "AI Content Generation",
    "Interaction Design",
    "Prototyping",
    "User Research",
    "Pitch Deck Design",
    "Editorial Design",
    "Environmental Graphics"
];

const skillsRow2 = [
    "Figma",
    "Photoshop",
    "Illustrator",
    "Premiere Pro",
    "After Effects",
    "Lightroom",
    "InDesign",
    "Blender",
    "Cinema 4D",
    "Canva",
    "Midjourney",
    "ChatGPT / Claude",
    "Nano Banana",
    "Firebase",
    "Vercel",
    "Framer",
    "Webflow",
    "VS Code",
    "GitHub",
    "CapCut",
    "DaVinci Resolve",
    "Notion",
    "Slack",
    "Click Up",
    "Sketchup",
    "Silverstack",
    "Nuendo",
    "Cubase",
    "Spline",
    "Antigravity",
    "Google Ai Studio",
    "Resolume"
];

export function CreativeStack() {
    const sectionRef = useRef<HTMLDivElement>(null);

    // Track scroll progress of this section
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // Transform scroll progress to duration (30s to 10s = faster on scroll)
    const duration1 = useTransform(scrollYProgress, [0, 1], [30, 10]);
    const duration2 = useTransform(scrollYProgress, [0, 1], [25, 8]);

    const [stackImages, setStackImages] = useState<string[]>([]);
    const [visualImages, setVisualImages] = useState<string[]>([]);
    const [stackIndex, setStackIndex] = useState(0);
    const [activeTaskIndex, setActiveTaskIndex] = useState(0);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await fetch('/api/brand-design-images');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setStackImages(data);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch stack images", e);
            }
        };
        fetchImages();

        const fetchVisuals = async () => {
            try {
                const res = await fetch('/api/visual-production-images', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setVisualImages(data);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch visual images", e);
            }
        };
        fetchVisuals();
    }, []);

    // Task List Animation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTaskIndex((prev) => (prev + 1) % 6); // Cycle 0 to 5 (5 items)
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (stackImages.length <= 1) return;
        const interval = setInterval(() => {
            setStackIndex((prev) => (prev + 1) % stackImages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [stackImages.length]);

    return (
        <section id="services" ref={sectionRef} className="relative w-full py-24 md:py-32 bg-background overflow-hidden">
            <div className="container mx-auto px-6 md:px-8 max-w-7xl">
                {/* Header */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    {/* Left: Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4 font-medium">
                            Creative Stack
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                            Beyond One Dimension.{" "}
                            <span className="text-foreground dark:text-primary">Full-Spectrum Execution.</span>
                        </h2>
                    </motion.div>

                    {/* Right: Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="flex items-center"
                    >
                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                            Great brands aren&apos;t built in silos, they are born at the intersection of strategy, art, and technology. With over a decade of experience, I offer a rare hybrid capability that bridges the gap between high-end visual storytelling and complex technical architecture. Whether I am directing a brand&apos;s visual identity or engineering its AI-powered infrastructure, my goal is singular: to create a solid, functional masterpiece that commands attention and delivers your message with precision.
                        </p>
                    </motion.div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 60, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{
                                duration: 0.7,
                                delay: index * 0.15,
                                ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                        >
                            <div className="group relative h-full flex flex-col p-8 rounded-3xl border border-border/50 bg-card/30 backdrop-blur-md hover:bg-card/50 transition-all duration-500 hover:border-foreground/10 dark:hover:border-primary/20 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-primary/5">
                                {/* Mockup/Visual Area */}
                                <div className={`relative mb-6 h-48 rounded-2xl overflow-hidden flex items-center justify-center ${service.mockup === "visual-slider" ? "bg-transparent" : "bg-gradient-to-br from-muted/50 to-muted/20 border border-border/30"}`}>
                                    {/* Task List Mockup */}
                                    {service.mockup === "task-list" && (
                                        <div className="w-full h-full p-4 flex flex-col justify-center">
                                            <div className="bg-background/90 backdrop-blur-md rounded-xl border border-border/50 p-4 w-full h-full flex flex-col shadow-sm relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

                                                <motion.div
                                                    className="flex flex-col gap-2.5 z-10"
                                                    animate={{ y: activeTaskIndex > 2 ? (activeTaskIndex - 2) * -34 : 0 }}
                                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                                >
                                                    {[
                                                        { label: "Discovery & Strategy", sub: "(The Why)" },
                                                        { label: "Conceptualization", sub: "(The Spark)" },
                                                        { label: "Design & Iteration", sub: "(The Build)" },
                                                        { label: "Refinement & Polish", sub: "(The Craft)" },
                                                        { label: "Delivery & Launch", sub: "(The Impact)" }
                                                    ].map((task, i) => {
                                                        const isChecked = i < activeTaskIndex;
                                                        return (
                                                            <div key={i} className="flex items-center gap-3">
                                                                <motion.div
                                                                    initial={false}
                                                                    className={`w-4 h-4 rounded-[4px] flex items-center justify-center border transition-colors duration-300 ${isChecked ? 'bg-primary border-primary' : 'border-muted-foreground/30 bg-muted/20'}`}
                                                                >
                                                                    <AnimatePresence>
                                                                        {isChecked && (
                                                                            <motion.div
                                                                                initial={{ scale: 0, opacity: 0 }}
                                                                                animate={{ scale: 1, opacity: 1 }}
                                                                                exit={{ scale: 0, opacity: 0 }}
                                                                            >
                                                                                <Check className="w-2.5 h-2.5 text-primary-foreground" strokeWidth={4} />
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </motion.div>
                                                                <div className={`flex items-baseline gap-1 text-xs transition-opacity duration-300 ${isChecked ? 'opacity-50' : 'opacity-100'}`}>
                                                                    <span className={`font-medium ${isChecked ? 'line-through decoration-border' : 'text-foreground'}`}>
                                                                        {task.label}
                                                                    </span>
                                                                    <span className="text-[10px] text-muted-foreground">
                                                                        {task.sub}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </motion.div>
                                            </div>
                                        </div>
                                    )}

                                    {/* UI/UX Mockup */}
                                    {service.mockup === "ui-ux" && (
                                        <div className="w-full h-full p-6 flex items-center justify-center">
                                            <div className="relative">
                                                <div className="w-32 h-24 rounded-xl bg-background/80 border border-border/50 p-3 flex flex-col items-center justify-center gap-2">
                                                    <div className="flex gap-2">
                                                        <div className="px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-medium">UI</div>
                                                        <div className="px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs font-medium">UX</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Visual Slider Mockup */}
                                    {service.mockup === "visual-slider" && (
                                        <div className="w-full h-full flex items-center overflow-hidden relative">
                                            {visualImages.length > 0 ? (
                                                <div className="w-full h-full">
                                                    <Marquee pauseOnHover className="[--duration:20s] h-full">
                                                        {visualImages.map((img) => (
                                                            <div key={img} className="relative h-full w-64 mx-2 rounded-xl overflow-hidden shrink-0">
                                                                <img src={img} alt="Visual Production" className="w-full h-full object-cover transition-transform hover:scale-110 duration-500" />
                                                            </div>
                                                        ))}
                                                    </Marquee>
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Sparkles className="w-5 h-5 opacity-50" />
                                                        <span>Loading visuals...</span>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Vignette Overlay */}
                                            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-background/50 via-transparent to-background/50" />
                                        </div>
                                    )}

                                    {/* Card Stack Mockup */}
                                    {service.mockup === "card-stack" && (
                                        <div className="w-full h-full relative flex items-center justify-center p-4">
                                            {stackImages.length > 0 ? (
                                                <div className="relative w-full h-full flex items-center justify-center translate-y-4">
                                                    <AnimatePresence mode="popLayout" initial={false}>
                                                        {[2, 1, 0].map((offset) => {
                                                            const imgIndex = (stackIndex + offset) % stackImages.length;
                                                            const imgUrl = stackImages[imgIndex];
                                                            if (!imgUrl) return null;

                                                            const scale = 1 - offset * 0.08;
                                                            const y = offset * -12;
                                                            const zIndex = 3 - offset;
                                                            const opacity = 1 - offset * 0.1;

                                                            return (
                                                                <motion.div
                                                                    key={imgUrl}
                                                                    layout
                                                                    className="absolute w-[85%] aspect-video rounded-lg bg-background shadow-xl overflow-hidden"
                                                                    initial={{ scale: 0.8, y: 10, opacity: 0, zIndex: 0 }}
                                                                    animate={{ scale, y, zIndex, opacity }}
                                                                    exit={{ scale: 1.05, y: -20, opacity: 0, zIndex: 4 }}
                                                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                                                >
                                                                    <img src={imgUrl} alt="Brand Design" className="w-full h-full object-cover" />
                                                                </motion.div>
                                                            );
                                                        })}
                                                    </AnimatePresence>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center h-full w-full">
                                                    <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
                                                        <Layout className="w-8 h-8" />
                                                        <span className="text-[10px]">Loading assets...</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Audit Mockup */}
                                    {service.mockup === "audit" && (
                                        <div className="w-full h-full p-6 flex items-center justify-center">
                                            <div className="w-full max-w-[200px] space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <service.icon className="h-5 w-5 text-foreground dark:text-primary" strokeWidth={1.5} />
                                                    <div className="flex-1 h-2 rounded-full bg-muted" />
                                                </div>
                                                <div className="flex items-center gap-2 pl-7">
                                                    <div className="flex-1 h-2 rounded-full bg-muted/60" />
                                                </div>
                                                <div className="flex items-center gap-2 pl-7">
                                                    <div className="flex-1 h-2 rounded-full bg-muted/40" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Digital Imaging Tech Mockup - Pulse Animation */}
                                    {service.mockup === "team" && (
                                        <div className="w-full h-full relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
                                            {/* Pulse Animation Rings */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <motion.div
                                                    className="absolute w-16 h-16 rounded-full border-2 border-primary/30"
                                                    animate={{
                                                        scale: [1, 2.5, 2.5],
                                                        opacity: [0.6, 0.2, 0],
                                                    }}
                                                    transition={{
                                                        duration: 3,
                                                        repeat: Infinity,
                                                        ease: "easeOut",
                                                    }}
                                                />
                                                <motion.div
                                                    className="absolute w-16 h-16 rounded-full border-2 border-primary/30"
                                                    animate={{
                                                        scale: [1, 2.5, 2.5],
                                                        opacity: [0.6, 0.2, 0],
                                                    }}
                                                    transition={{
                                                        duration: 3,
                                                        repeat: Infinity,
                                                        ease: "easeOut",
                                                        delay: 1,
                                                    }}
                                                />
                                                <motion.div
                                                    className="absolute w-16 h-16 rounded-full border-2 border-primary/30"
                                                    animate={{
                                                        scale: [1, 2.5, 2.5],
                                                        opacity: [0.6, 0.2, 0],
                                                    }}
                                                    transition={{
                                                        duration: 3,
                                                        repeat: Infinity,
                                                        ease: "easeOut",
                                                        delay: 2,
                                                    }}
                                                />
                                            </div>

                                            {/* Center Icon */}
                                            <div className="relative z-10 w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center p-2">
                                                <Image
                                                    src="/assets/jrslogowhite.svg"
                                                    alt="JRS Logo"
                                                    width={32}
                                                    height={32}
                                                    className="w-full h-full object-contain invert-0 dark:invert"
                                                />
                                            </div>

                                            {/* Floating Labels - Positioned in circular pattern */}
                                            {/* Top Left */}
                                            <motion.div
                                                className="absolute top-6 left-4 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-[10px] font-medium shadow-sm"
                                                animate={{ y: [0, -4, 0] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            >
                                                Data Wrangler
                                            </motion.div>
                                            {/* Top Right */}
                                            <motion.div
                                                className="absolute top-6 right-4 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-[10px] font-medium shadow-sm"
                                                animate={{ y: [0, -4, 0] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                                            >
                                                Live Exposure
                                            </motion.div>
                                            {/* Middle Left */}
                                            <motion.div
                                                className="absolute top-1/2 -translate-y-1/2 left-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-[10px] font-medium shadow-sm"
                                                animate={{ y: [0, -4, 0] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                                            >
                                                Data Management
                                            </motion.div>
                                            {/* Middle Right */}
                                            <motion.div
                                                className="absolute top-1/2 -translate-y-1/2 right-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-[10px] font-medium shadow-sm"
                                                animate={{ y: [0, -4, 0] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
                                            >
                                                Color Monitoring
                                            </motion.div>
                                            {/* Bottom Left */}
                                            <motion.div
                                                className="absolute bottom-6 left-4 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-[10px] font-medium shadow-sm"
                                                animate={{ y: [0, -4, 0] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                                            >
                                                Camera Settings
                                            </motion.div>
                                            {/* Bottom Center */}
                                            <motion.div
                                                className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-[10px] font-medium shadow-sm"
                                                animate={{ y: [0, -4, 0] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                                            >
                                                Color Calibration
                                            </motion.div>
                                            {/* Bottom Right */}
                                            <motion.div
                                                className="absolute bottom-6 right-4 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-[10px] font-medium shadow-sm"
                                                animate={{ y: [0, -4, 0] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
                                            >
                                                Live Preview
                                            </motion.div>
                                        </div>
                                    )}

                                    {/* Workflow Mockup - AI Web Designer Animation */}
                                    {service.mockup === "workflow" && (
                                        <div className="w-full h-full p-4 flex flex-col items-center justify-center">
                                            <div className="relative w-full h-full">
                                                {/* Background SVG Lines */}
                                                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                                                    {/* Background Static Lines */}
                                                    <path
                                                        d="M50,15 L50,20 M50,30 L20,30 L20,60 L50,60 M50,30 L80,30 L80,60 L50,60 M50,70 L50,75 M50,85 L50,90"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeOpacity="0.2"
                                                        strokeWidth="0.5"
                                                    />

                                                    {/* Top Diamond */}
                                                    <path d="M50,20 L55,25 L50,30 L45,25 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.5" />

                                                    {/* Bottom Diamond */}
                                                    <path d="M50,60 L55,65 L50,70 L45,65 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.5" />

                                                    {/* Animated Beam Effect */}
                                                    <motion.path
                                                        d="M50,15 L50,20 L45,25 L50,30 L20,30 L20,60 L50,60 L50,70 L50,75"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1"
                                                        className="text-foreground dark:text-primary"
                                                        initial={{ pathLength: 0, opacity: 0 }}
                                                        animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                                    />
                                                    <motion.path
                                                        d="M50,30 L80,30 L80,60 L50,60"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1"
                                                        className="text-foreground dark:text-primary"
                                                        initial={{ pathLength: 0, opacity: 0 }}
                                                        animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                                                        transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
                                                    />
                                                </svg>

                                                {/* Nodes Layer - Positioned absolutely to match SVG coordinates */}

                                                {/* Top: Design */}
                                                <div className="absolute top-[5%] left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-background border border-border rounded-full shadow-sm z-10">
                                                    <Palette className="w-3 h-3 text-foreground dark:text-primary" />
                                                    <span className="text-[10px] font-medium">Design</span>
                                                </div>

                                                {/* Middle Left: AI */}
                                                <div className="absolute top-[40%] left-[20%] flex items-center gap-1.5 px-3 py-1 bg-background border border-border rounded-full shadow-sm z-10 -translate-x-1/2">
                                                    <Brain className="w-3 h-3 text-foreground dark:text-primary" />
                                                    <span className="text-[10px] font-medium">AI</span>
                                                </div>

                                                {/* Middle Right: Instructions */}
                                                <div className="absolute top-[40%] right-[5%] flex items-center gap-1.5 px-3 py-1 bg-background border border-border rounded-full shadow-sm z-10 translate-x-1/8">
                                                    <FileText className="w-3 h-3 text-foreground dark:text-primary" />
                                                    <span className="text-[10px] font-medium">Instructions</span>
                                                </div>

                                                {/* Bottom Stack: Code */}
                                                <div className="absolute top-[75%] left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-background border border-border rounded-full shadow-sm z-10">
                                                    <Code2 className="w-3 h-3 text-foreground dark:text-primary" />
                                                    <span className="text-[10px] font-medium">Code</span>
                                                </div>

                                                {/* Bottom Stack: Result */}
                                                <div className="absolute top-[90%] left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-background border border-border rounded-full shadow-sm z-10">
                                                    <Layout className="w-3 h-3 text-foreground dark:text-primary" />
                                                    <span className="text-[10px] font-medium">Result</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}


                                </div>

                                {/* Title */}
                                <h3 className="mb-3 text-xl font-bold text-foreground tracking-tight">
                                    {service.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {service.description}
                                </p>

                                {/* Gradient Overlay on Hover */}
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent to-black/5 dark:from-primary/0 dark:via-primary/0 dark:to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Marquee Skills Tags - Outside Container for proper overlay */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="relative mt-20"
                >
                    {/* Left Fade Overlay */}
                    <div className="absolute top-0 bottom-0 left-0 w-40 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />

                    {/* Right Fade Overlay */}
                    <div className="absolute top-0 bottom-0 right-0 w-40 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />

                    {/* Marquee Container */}
                    <div className="space-y-2">
                        {/* Row 1 - Right to Left */}
                        <div className="relative overflow-hidden">
                            <motion.div
                                className="flex gap-4 whitespace-nowrap will-change-transform"
                                animate={{ x: [0, -1920] }}
                                transition={{
                                    x: {
                                        repeat: Infinity,
                                        repeatType: "loop",
                                        duration: 30,
                                        ease: "linear",
                                    },
                                }}
                            >
                                {[...skillsRow1, ...skillsRow1, ...skillsRow1, ...skillsRow1].map((skill, i) => (
                                    <span
                                        key={`row1-${skill}-${i}`}
                                        className="px-6 py-3 text-sm font-medium text-muted-foreground bg-muted/50 rounded-full border border-border/50 flex-shrink-0"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </motion.div>
                        </div>

                        {/* Row 2 - Left to Right (Opposite Direction) */}
                        <div className="relative overflow-hidden">
                            <motion.div
                                className="flex gap-4 whitespace-nowrap will-change-transform"
                                animate={{ x: [-1920, 0] }}
                                transition={{
                                    x: {
                                        repeat: Infinity,
                                        repeatType: "loop",
                                        duration: 25,
                                        ease: "linear",
                                    },
                                }}
                            >
                                {[...skillsRow2, ...skillsRow2, ...skillsRow2, ...skillsRow2].map((skill, i) => (
                                    <span
                                        key={`row2-${skill}-${i}`}
                                        className="px-6 py-3 text-sm font-medium text-muted-foreground bg-muted/50 rounded-full border border-border/50 flex-shrink-0"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section >
    );
}
