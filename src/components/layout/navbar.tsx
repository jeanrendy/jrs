"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { ThreeDLogo } from "@/components/ui/3d-logo";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { motion, useScroll, useMotionValueEvent, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useCursor } from "@/context/cursor-context";
import { useLenis } from "lenis/react";
import { useRef } from "react";

const navItems = [
    { name: "SERVICES", href: "/#services" },
    {
        name: "WORKS",
        href: "/#work",
        submenu: [
            { name: "Selected Works", href: "/#work" },
            { name: "Websites", href: "/#websites" },
            { name: "Videos", href: "/#video-productions" },
            { name: "Experiences", href: "/#about" }
        ]
    },
    { name: "ABOUT", href: "/#about" },
];

export function Navbar() {
    const { scrollY } = useScroll();
    const { setIsHovered } = useCursor();
    const [hidden, setHidden] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);
    const lenis = useLenis();

    const scrollToFooter = () => {
        lenis?.scrollTo(document.body.scrollHeight, { duration: 3 });
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith("/#")) {
            e.preventDefault();
            const id = href.replace("/#", "");
            const element = document.getElementById(id);
            if (element) {
                lenis?.scrollTo(element, { duration: 2 });
            }
            setMobileMenuOpen(false);
        }
    };

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        // Check window width. If mobile (< 768), don't hide.
        if (typeof window !== "undefined" && window.innerWidth < 768) {
            setHidden(false);
            return;
        }

        // Hide only if scrolling down AND we are past the hero section (1 viewport height)
        if (latest > previous && latest > (typeof window !== "undefined" ? window.innerHeight : 800)) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    return (
        <>
            <motion.header
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                variants={{
                    visible: { y: 0, opacity: 1 },
                    hidden: { y: "-100%", opacity: 0 },
                }}
                animate={hidden ? "hidden" : "visible"}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="fixed top-6 left-1/2 -translate-x-1/2 z-[70] w-[90%] md:w-auto md:min-w-[500px] flex items-center justify-between px-6 py-3 rounded-full border border-border/40 bg-background/70 backdrop-blur-xl shadow-lg supports-[backdrop-filter]:bg-background/60"
            >
                {/* Logo */}
                <Link
                    href="/"
                    className="pointer-events-auto flex items-center gap-2"
                    onClick={(e) => {
                        if (window.location.pathname === "/") {
                            e.preventDefault();
                            lenis?.scrollTo(0, { duration: 2 });
                        }
                        setMobileMenuOpen(false);
                    }}
                >
                    <ThreeDLogo />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1 pointer-events-auto ml-8">
                    {navItems.map((item) => (
                        <div
                            key={item.name}
                            className="relative h-full flex items-center"
                            onMouseEnter={() => setHoveredItem(item.name)}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <Link
                                href={item.href}
                                onClick={(e) => handleNavClick(e, item.href)}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1.5 px-4 rounded-full hover:bg-foreground/5 block"
                            >
                                {item.name}
                            </Link>

                            {/* Submenu Dropdown */}
                            <AnimatePresence>
                                {item.submenu && hoveredItem === item.name && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full left-0 mt-2 w-48 bg-background/80 backdrop-blur-xl border border-border rounded-xl shadow-xl overflow-hidden py-2 flex flex-col gap-1 ring-1 ring-black/5"
                                    >
                                        {item.submenu.map((sub) => (
                                            <Link
                                                key={sub.name}
                                                href={sub.href}
                                                onClick={(e) => {
                                                    handleNavClick(e, sub.href);
                                                    setHoveredItem(null);
                                                }}
                                                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors text-left"
                                            >
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}

                    <div className="w-px h-4 bg-border mx-2" />

                    <div className="flex items-center gap-2">
                        <AnimatedThemeToggler />
                        <MagneticButton onClick={scrollToFooter}>
                            Let&apos;s Talk
                        </MagneticButton>
                    </div>
                </nav>

                {/* Mobile Nav Placeholder */}
                <div className="md:hidden pointer-events-auto flex items-center gap-2">
                    <AnimatedThemeToggler />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-foreground"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span className="sr-only">Menu</span>
                        {mobileMenuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                        )}
                    </Button>
                </div>
            </motion.header>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl pt-32 px-6 md:hidden"
                    >
                        <nav className="flex flex-col gap-6 text-2xl font-medium">
                            {navItems.map((item) => (
                                <div key={item.name} className="flex flex-col">
                                    {item.submenu ? (
                                        <>
                                            <div
                                                className="flex justify-between items-center p-2 hover:text-primary transition-colors cursor-pointer select-none"
                                                onClick={() => setExpandedMobileItem(expandedMobileItem === item.name ? null : item.name)}
                                            >
                                                {item.name}
                                                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${expandedMobileItem === item.name ? "rotate-180" : ""}`} />
                                            </div>
                                            <AnimatePresence>
                                                {expandedMobileItem === item.name && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden flex flex-col pl-4 gap-4 text-lg text-muted-foreground"
                                                    >
                                                        <div className="py-2 flex flex-col gap-4">
                                                            {item.submenu.map((sub) => (
                                                                <Link
                                                                    key={sub.name}
                                                                    href={sub.href}
                                                                    onClick={(e) => {
                                                                        handleNavClick(e, sub.href);
                                                                    }}
                                                                    className="block hover:text-foreground transition-colors"
                                                                >
                                                                    {sub.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            onClick={(e) => handleNavClick(e, item.href)}
                                            className="block p-2 hover:text-primary transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    )}
                                </div>
                            ))}
                            <div className="h-px bg-border my-4" />
                            <Button
                                className="w-full text-lg h-12 rounded-full"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    scrollToFooter();
                                }}
                            >
                                Let&apos;s Talk
                            </Button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// Magnetic Button Component with Hover Border Gradient
function MagneticButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
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
        x.set(middleX * 0.3);
        y.set(middleY * 0.3);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: springX, y: springY }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-auto cursor-pointer"
        >
            <HoverBorderGradient
                onClick={onClick}
                containerClassName="pointer-events-auto cursor-pointer"
                className="text-xs font-semibold text-foreground cursor-pointer"
                duration={1}
            >
                {children}
            </HoverBorderGradient>
        </motion.div>
    );
}
