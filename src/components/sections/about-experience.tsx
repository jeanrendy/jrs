"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { ChevronDown, Briefcase, Calendar, MapPin, ExternalLink } from "lucide-react";
import { useLenis } from "lenis/react";

interface Experience {
    id: string;
    title: string;
    company: string;
    companyUrl?: string;
    location: string;
    locationType: string;
    startDate: string;
    endDate: string | null;
    duration: string;
    description: string[];
    skills: string[];
}

const experiences: Experience[] = [
    {
        id: "1",
        title: "Creative Director",
        company: "DCRM",
        location: "Australia",
        locationType: "Remote",
        startDate: "May 2025",
        endDate: null,
        duration: "9 mos",
        description: [
            "Leading creative direction for full-time projects",
            "Managing project coordination and quality control",
            "Developing creative concepts for social media advertising campaigns",
            "Overseeing video production from concept to delivery",
        ],
        skills: ["Project Management", "Project Coordination", "Creative Direction", "Quality Control", "Creative Concept Design", "Social Media Advertising", "Video Production"],
    },
    {
        id: "2",
        title: "Product Designer",
        company: "OneCo",
        location: "United States",
        locationType: "Remote",
        startDate: "Apr 2023",
        endDate: "Mar 2024",
        duration: "1 yr",
        description: [
            "Designed user experiences using Agile methodologies",
            "Created mobile and web interface prototypes",
            "Developed comprehensive design systems",
            "Delivered branding and identity solutions",
        ],
        skills: ["User Experience (UX)", "Agile Methodologies", "User Interface Design", "User Experience Design (UED)", "User Interface Prototyping", "Mobile Interface Design", "Branding & Identity", "Graphic Design", "Product Design", "Software Design", "Web Design", "Wireframing", "Design system"],
    },
    {
        id: "3",
        title: "Senior UI/UX Designer",
        company: "yfood Labs",
        location: "United Kingdom",
        locationType: "Remote",
        startDate: "Mar 2022",
        endDate: "Apr 2023",
        duration: "1 yr 2 mos",
        description: [
            "Applied design thinking to create responsive web experiences",
            "Led usability testing and user research initiatives",
            "Managed project timelines and deliverables",
            "Produced video content and edited promotional materials",
        ],
        skills: ["Design Thinking", "Responsive Web Design", "Social Media", "Design", "Wireframing", "Corporate Identity", "Project Management", "Video Editing", "Usability Testing", "Video Production"],
    },
    {
        id: "4",
        title: "Product Designer",
        company: "JULO",
        location: "Indonesia",
        locationType: "Hybrid",
        startDate: "Aug 2021",
        endDate: "Feb 2022",
        duration: "7 mos",
        description: [
            "Created mockups and prototypes for financial products",
            "Developed and maintained design systems",
            "Led team collaboration on user interface design",
            "Applied design thinking to solve complex UX challenges",
        ],
        skills: ["User Experience Design (UED)", "Mockups", "Design Thinking", "Responsive Web Design", "Design system", "Wireframing", "Prototyping", "User Interface Design", "Team Leadership"],
    },
    {
        id: "5",
        title: "Product Designer",
        company: "Baezeni",
        location: "Greater Jakarta Area, Indonesia",
        locationType: "Hybrid",
        startDate: "May 2019",
        endDate: "Jul 2021",
        duration: "2 yrs 3 mos",
        description: [
            "Visualization hub catering to multiple markets world-wide",
            "Created 3D visualizations using Cinema 4D and Blender",
            "Designed landing pages and responsive web experiences",
            "Provided visual direction and creative leadership for projects",
        ],
        skills: ["Cinema 4D", "User Experience Design (UED)", "Landing Pages", "Visual Direction", "Design Thinking", "Adobe Creative Suite", "Responsive Web Design", "Design system", "Social Media", "3D Visualization", "Design", "Wireframing", "Creative Direction", "Product Design", "Graphic Design", "Project Management", "Blender", "Branding", "User Experience (UX)", "Video Editing", "Adobe Photoshop", "User Interface Design", "Usability Testing", "Web Design", "Video Production", "Team Leadership"],
    },
    {
        id: "6",
        title: "Sr. UI & UX Designer",
        company: "Atoma Medical",
        location: "Jl. Palmerah Barat, Jakarta Selatan",
        locationType: "On-site",
        startDate: "Mar 2017",
        endDate: "Mar 2019",
        duration: "2 yrs 1 mo",
        description: [
            "Led visual direction for medical technology interfaces",
            "Applied design thinking to healthcare user experiences",
            "Conducted usability testing for medical applications",
            "Managed team collaboration and communication",
        ],
        skills: ["Visual Direction", "Design Thinking", "Responsive Web Design", "Social Media", "Design", "Wireframing", "Communication", "Adobe Photoshop", "Usability Testing", "Team Leadership"],
    },
    {
        id: "7",
        title: "UI & UX Designer",
        company: "Pergikuliner.com",
        location: "Greater Jakarta Area, Indonesia",
        locationType: "On-site",
        startDate: "Jan 2017",
        endDate: "Mar 2017",
        duration: "3 mos",
        description: [
            "Designed responsive web interfaces for culinary platform",
            "Created wireframes and user flows",
            "Collaborated with development team on implementation",
            "Applied design thinking to improve user experience",
        ],
        skills: ["Design Thinking", "Responsive Web Design", "Design", "Wireframing", "Communication"],
    },
    {
        id: "8",
        title: "Graphic Design & Layout Magazine (freelance)",
        company: "PT. Gramedia Pustaka Utama",
        location: "Jakarta",
        locationType: "Freelance",
        startDate: "Nov 2013",
        endDate: "Mar 2017",
        duration: "3 yrs 5 mos",
        description: [
            "Designed graphic layouts for magazine publications",
            "Created visual content for social media",
            "Managed multiple freelance projects simultaneously",
            "Delivered high-quality designs using Adobe Photoshop",
        ],
        skills: ["Social Media", "Design", "Adobe Photoshop"],
    },
    {
        id: "9",
        title: "Creative Director",
        company: "TEMAN Productions",
        location: "Jl. H. Syaip Ujung Kav. 7",
        locationType: "On-site",
        startDate: "Feb 2016",
        endDate: "Dec 2016",
        duration: "11 mos",
        description: [
            "TV Program - Movie Making - TVC production",
            "Digital & Print Ads - Branding & Solution",
            "Event Organizer and creative direction",
            "3D modeling and visualization for productions",
        ],
        skills: ["Cinema 4D", "Visual Direction", "3D Modeling", "Social Media", "3D Visualization", "Design", "Corporate Identity", "Creative Direction", "Blender", "Video Editing", "Adobe Photoshop", "Product Photography", "Video Production", "Team Leadership"],
    },
    {
        id: "10",
        title: "Graphic Designer & UI/UX Designer",
        company: "PT DK Global Indonesia",
        location: "Gandaria office 8",
        locationType: "On-site",
        startDate: "Aug 2014",
        endDate: "Feb 2016",
        duration: "1 yr 7 mos",
        description: [
            "Design ads, Branding, UI/UX for desktop and apps",
            "Motion Graphic and Photography",
            "Created 3D visualizations and models",
            "Developed corporate identity systems",
        ],
        skills: ["Cinema 4D", "Visual Direction", "3D Modeling", "Responsive Web Design", "Social Media", "3D Visualization", "Design", "Corporate Identity", "Creative Direction", "Video Editing", "Adobe Photoshop", "Product Photography", "Video Production", "Team Leadership"],
    },
    {
        id: "11",
        title: "Graphic Designer - Photographer",
        company: "FORWARD IB",
        location: "Greater Jakarta Area, Indonesia",
        locationType: "Hybrid",
        startDate: "Jan 2013",
        endDate: "Feb 2014",
        duration: "1 yr 2 mos",
        description: [
            "Creative agency: Event Organizing - Event Planner",
            "Yearbook Production - TVC",
            "Branding Company services",
            "Photography and visual direction",
        ],
        skills: ["Visual Direction", "Design", "Corporate Identity", "Video Editing", "Adobe Photoshop", "Product Photography", "Video Production"],
    },
    {
        id: "12",
        title: "Head Creative",
        company: "SMART MEDIA",
        location: "Jakarta",
        locationType: "On-site",
        startDate: "Jun 2012",
        endDate: "Nov 2013",
        duration: "1 yr 6 mos",
        description: [
            "Creative Art Director - Graphic Design",
            "Photographer - Video Editor",
            "Led creative team and direction",
            "Managed social media and corporate identity projects",
        ],
        skills: ["Visual Direction", "Social Media", "Design", "Corporate Identity", "Creative Direction", "Video Editing", "Adobe Photoshop", "Product Photography", "Video Production", "Team Leadership"],
    },
    {
        id: "13",
        title: "Graphic Designer",
        company: "PT. MITRA KENCANA UTAMA",
        location: "Ruko Duta Mas Fatmawati, Jakarta",
        locationType: "On-site",
        startDate: "Apr 2011",
        endDate: "May 2012",
        duration: "1 yr 2 mos",
        description: [
            "Created graphic designs for various projects",
            "Developed visual materials using Adobe Photoshop",
            "Supported branding and marketing initiatives",
            "Delivered design solutions for clients",
        ],
        skills: ["Design", "Adobe Photoshop"],
    },
    {
        id: "14",
        title: "Creative Designer",
        company: "Rise Org.",
        location: "Jl. Limau Kebayoran Lama",
        locationType: "On-site",
        startDate: "Mar 2009",
        endDate: "Oct 2011",
        duration: "2 yrs 8 mos",
        description: [
            "Designed creative materials for organization",
            "Video editing and production",
            "Created visual content using Adobe Photoshop",
            "Supported various creative projects",
        ],
        skills: ["Design", "Video Editing", "Adobe Photoshop", "Video Production"],
    },
    {
        id: "15",
        title: "Graphic Designer",
        company: "Komuni-tas.com",
        location: "Apartement MGR tanjung duren tower 2",
        locationType: "Hybrid",
        startDate: "Feb 2010",
        endDate: "Apr 2011",
        duration: "1 yr 3 mos",
        description: [
            "Designed graphics for online community platform",
            "Created visual content and layouts",
            "Worked remotely and on-site as needed",
            "Delivered design solutions using Adobe Photoshop",
        ],
        skills: ["Design", "Adobe Photoshop"],
    },
    {
        id: "16",
        title: "Creative Designer",
        company: "The Brain",
        location: "Jl. Bangun Reksa, Pd. Pucung, Karang Tengah, Kota Tangerang, Banten",
        locationType: "On-site",
        startDate: "Feb 2008",
        endDate: "May 2009",
        duration: "1 yr 4 mos",
        description: [
            "Created design materials for creative agency",
            "Video editing and production work",
            "Developed visual content using Adobe Photoshop",
            "Supported various creative projects and campaigns",
        ],
        skills: ["Design", "Video Editing", "Adobe Photoshop", "Video Production"],
    },
];

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

export function AboutExperience() {
    const { theme } = useTheme();
    const lenis = useLenis();
    const [mounted, setMounted] = useState(false);
    const isDark = theme === "dark";
    const [openId, setOpenId] = useState<string | null>(experiences[0]?.id || null);
    const [showAll, setShowAll] = useState(false);

    const displayedExperiences = showAll ? experiences : experiences.slice(0, 5);

    // Prevent hydration mismatch by only rendering theme-dependent content after mount
    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleAccordion = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    // Prevent hydration mismatch - render with default theme until mounted
    if (!mounted) {
        return (
            <section id="about" className="relative py-24 md:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
                <div className="container mx-auto px-6 md:px-8 max-w-7xl relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 md:mb-16">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-4 md:mb-6">
                                Experience
                            </h2>
                            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                                {experiences.length}+ positions across creative, design, and leadership roles
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm md:text-base border transition-all duration-300">
                                View LinkedIn
                                <ExternalLink className="w-4 h-4" />
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="about" className="relative py-24 md:py-32 overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? "white" : "black"} 1px, transparent 0)`,
                    backgroundSize: "40px 40px",
                }}
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
                                <span className={isDark ? "text-white" : "text-black"}>Experience</span>
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
                                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm md:text-base transition-all duration-300 ${isDark
                                    ? "bg-white text-black hover:bg-white/90"
                                    : "bg-black text-white hover:bg-black/90"
                                    }`}
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
                                            className={`rounded-2xl border backdrop-blur-sm transition-all duration-300 ${isDark
                                                ? "bg-white/[0.03] border-white/10 hover:bg-white/[0.05]"
                                                : "bg-black/[0.03] border-black/10 hover:bg-black/[0.05]"
                                                } ${isOpen ? "shadow-lg" : ""}`}
                                        >
                                            {/* Accordion Header */}
                                            <button
                                                onClick={() => toggleAccordion(exp.id)}
                                                className="w-full p-6 md:p-8 text-left flex items-start gap-4 md:gap-6 group"
                                            >
                                                {/* Icon */}
                                                <div
                                                    className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${isDark
                                                        ? "border-white/20 bg-white/5 group-hover:bg-white/10"
                                                        : "border-black/20 bg-black/5 group-hover:bg-black/10"
                                                        } ${isOpen ? "scale-110" : ""}`}
                                                >
                                                    <Briefcase className={`w-5 h-5 md:w-6 md:h-6 ${isDark ? "text-white" : "text-black"}`} />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-4 mb-2">
                                                        <div className="flex-1 min-w-0">
                                                            <h3
                                                                className={`text-xl md:text-2xl font-bold mb-1 ${isDark ? "text-white" : "text-black"
                                                                    }`}
                                                            >
                                                                {exp.title}
                                                            </h3>
                                                            <p className={`text-base md:text-lg font-medium ${isDark ? "text-white/70" : "text-black/70"}`}>
                                                                {exp.company}
                                                            </p>
                                                        </div>
                                                        <div
                                                            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium ${isDark ? "bg-white/10 text-white/90" : "bg-black/10 text-black/90"
                                                                }`}
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
                                                        className={`w-5 h-5 md:w-6 md:h-6 ${isDark ? "text-white/50" : "text-black/50"}`}
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
                                                                        className={`flex items-start gap-3 text-sm md:text-base ${isDark ? "text-white/60" : "text-black/60"
                                                                            }`}
                                                                    >
                                                                        <span
                                                                            className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDark ? "bg-white/40" : "bg-black/40"
                                                                                }`}
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
                                                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${isDark
                                                                                ? "bg-white/5 text-white/70 border border-white/10"
                                                                                : "bg-black/5 text-black/70 border border-black/10"
                                                                                }`}
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
                                                                    className={`inline-flex items-center gap-2 mt-4 text-sm font-medium hover:underline ${isDark ? "text-white/80" : "text-black/80"
                                                                        }`}
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
                            className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium text-base md:text-lg transition-all duration-300 border ${isDark
                                ? "border-white/20 hover:bg-white/10 text-white"
                                : "border-black/20 hover:bg-black/5 text-black"
                                }`}
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
