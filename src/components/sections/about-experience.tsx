"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { ChevronDown, Briefcase, Calendar, MapPin, ExternalLink } from "lucide-react";
import { useLenis } from "lenis/react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { STATIC_EXPERIENCES, type Experience } from "@/data/experiences";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1] as const,
        },
    },
} as const;

const parseDateForSort = (dateStr: string | null) => {
    if (!dateStr || dateStr.toLowerCase() === "present") return new Date().getTime();
    const time = new Date(dateStr).getTime();
    return isNaN(time) ? 0 : time;
};

const sortExperiences = (exps: Experience[]) => {
    return [...exps].sort((a, b) => {
        const aStart = parseDateForSort(a.startDate);
        const bStart = parseDateForSort(b.startDate);
        const aEnd = parseDateForSort(a.endDate);
        const bEnd = parseDateForSort(b.endDate);

        // Sort by start date (newest first)
        if (bStart !== aStart) {
            return bStart - aStart;
        }
        // If start dates are the same, order by end date (newest first)
        return bEnd - aEnd;
    });
};

const sortedStaticExperiences = sortExperiences(STATIC_EXPERIENCES);

export function AboutExperience() {
    const lenis = useLenis();
    // Initialize with static data for SSR/SEO, then hydration matches
    const [experiences, setExperiences] = useState<Experience[]>(sortedStaticExperiences);
    const [openId, setOpenId] = useState<string | null>(sortedStaticExperiences[0]?.id || null);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const fetchExperiences = async () => {
            if (!db) return;
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const q = query(collection(db as any, "experiences"), orderBy("createdAt", "desc")); // Assuming createdAt sort? Or custom order
                // If we want specific order, we might need a sort function or field.
                // For now, let's fetch and if empty, do nothing (keep static).
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    const data: Experience[] = [];
                    snapshot.forEach((doc) => {
                        // Prioritize doc.id to ensure uniqueness and key stability
                        data.push({ ...doc.data(), id: doc.id } as Experience);
                    });

                    // Optional: Sort by start date if not ordered?
                    // Expected to sort locally using the date strings regardless of DB order
                    const sortedFetchedData = sortExperiences(data);

                    // We'll re-set state.
                    setExperiences(sortedFetchedData as any);

                    // Update openId if it matches previous default logic, or keep user selection?
                    // Safe to leave openId as is, or reset if data changes drastically.
                }
            } catch (error) {
                console.error("Error fetching experiences:", error);
            }
        };

        fetchExperiences();
    }, []);

    const displayedExperiences = showAll ? experiences : experiences.slice(0, 5);

    // Hydration fix: Remove manual mounted check, rely on CSS dark mode
    const toggleAccordion = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <section id="about" className="relative py-24 md:py-32 overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />

            {/* Grid pattern overlay */}
            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(circle_at_1px_1px,black_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:40px_40px]"
            />

            <div className="container mx-auto px-6 md:px-8 max-w-7xl relative z-10">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                >
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 md:mb-16">
                        <motion.div variants={itemVariants} className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-4 md:mb-6">
                                <span className="text-black dark:text-white">Experience</span>
                            </h2>
                            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                                {experiences.length}+ positions across creative, design, and leadership roles
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex-shrink-0">
                            <a
                                href="https://www.linkedin.com/in/jeanrendy/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm md:text-base transition-all duration-300 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                            >
                                View LinkedIn
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </motion.div>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                        <AnimatePresence mode="popLayout">
                            {displayedExperiences.map((exp, index) => {
                                const isOpen = openId === exp.id;

                                return (
                                    <motion.div
                                        key={exp.id}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, margin: "-50px" }}
                                        variants={itemVariants}
                                        transition={{
                                            duration: 1.2,
                                            ease: [0.25, 0.46, 0.45, 0.94],
                                            delay: index < 5 ? (index * 0.15) + 1 : (index - 5) * 0.15
                                        }}
                                        layout
                                    >
                                        <div
                                            className={`rounded-2xl border backdrop-blur-sm transition-all duration-300 bg-black/[0.03] border-black/10 hover:bg-black/[0.05] dark:bg-white/[0.03] dark:border-white/10 dark:hover:bg-white/[0.05] ${isOpen ? "shadow-lg" : ""}`}
                                        >
                                            {/* Accordion Header */}
                                            <button
                                                onClick={() => toggleAccordion(exp.id)}
                                                className="w-full p-6 md:p-8 text-left flex items-start gap-4 md:gap-6 group"
                                            >
                                                {/* Icon */}
                                                <div
                                                    className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl border-2 flex items-center justify-center transition-all duration-300 border-black/20 bg-black/5 group-hover:bg-black/10 dark:border-white/20 dark:bg-white/5 dark:group-hover:bg-white/10 ${isOpen ? "scale-110" : ""}`}
                                                >
                                                    <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-black dark:text-white" />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-4 mb-2">
                                                        <div className="flex-1 min-w-0">
                                                            <h3
                                                                className="text-xl md:text-2xl font-bold mb-1 text-black dark:text-white"
                                                            >
                                                                {exp.title}
                                                            </h3>
                                                            <p className="text-base md:text-lg font-medium text-black/70 dark:text-white/70">
                                                                {exp.company}
                                                            </p>
                                                        </div>
                                                        <div
                                                            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium bg-black/10 text-black/90 dark:bg-white/10 dark:text-white/90"
                                                        >
                                                            {exp.duration}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-3 md:gap-4 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                            <span>
                                                                {exp.startDate} - {exp.endDate || "Present"}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                            <span>
                                                                {exp.location} · {exp.locationType}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Chevron */}
                                                <motion.div
                                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                                    className="flex-shrink-0"
                                                >
                                                    <ChevronDown
                                                        className="w-5 h-5 md:w-6 md:h-6 text-black/50 dark:text-white/50"
                                                    />
                                                </motion.div>
                                            </button>

                                            {/* Accordion Content */}
                                            <AnimatePresence initial={false}>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0 md:pl-[88px]">
                                                            {/* Description */}
                                                            <ul className="space-y-3 mb-6">
                                                                {exp.description.map((item, idx) => (
                                                                    <li
                                                                        key={idx}
                                                                        className="flex items-start gap-3 text-sm md:text-base text-black/60 dark:text-white/60"
                                                                    >
                                                                        <span
                                                                            className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-black/40 dark:bg-white/40"
                                                                        />
                                                                        <span>{item}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>

                                                            {/* Skills */}
                                                            {exp.skills && exp.skills.length > 0 && (
                                                                <div className="flex flex-wrap gap-2">
                                                                    {exp.skills.map((skill, idx) => (
                                                                        <span
                                                                            key={idx}
                                                                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-black/5 text-black/70 border border-black/10 dark:bg-white/5 dark:text-white/70 dark:border-white/10"
                                                                        >
                                                                            {skill}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {/* Company Link */}
                                                            {exp.companyUrl && (
                                                                <a
                                                                    href={exp.companyUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-2 mt-4 text-sm font-medium hover:underline text-black/80 dark:text-white/80"
                                                                >
                                                                    Visit {exp.company}
                                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Show More Button */}
                    <motion.div variants={itemVariants} className="mt-12 md:mt-16 text-center">
                        <button
                            onClick={() => {
                                if (showAll) {
                                    // Scroll to top of section using Lenis for consistency with global scroll behavior
                                    const element = document.getElementById("about");
                                    if (element) {
                                        if (lenis) {
                                            lenis.scrollTo(element, { offset: -50, duration: 1.5 });
                                        } else {
                                            element.scrollIntoView({ behavior: "smooth" });
                                        }
                                    }
                                }
                                setShowAll(!showAll);
                            }}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium text-base md:text-lg transition-all duration-300 border border-black/20 hover:bg-black/5 text-black dark:border-white/20 dark:hover:bg-white/10 dark:text-white"
                        >
                            {showAll ? "Show Less" : "Show More"}
                            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showAll ? "rotate-180" : ""}`} />
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
