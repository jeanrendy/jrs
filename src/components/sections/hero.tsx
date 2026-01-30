"use client";
import { HeroScene } from "@/components/3d/hero-scene";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export interface HeroContent {
    role: string;
    name: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
}

export function HeroSection({ content }: { content?: HeroContent }) {
    const {
        role = "Creative Developer",
        name = "JEAN RENDY",
        description = "I’m Jean, your digital design sidekick. Got a crazy idea? Let’s bring it to life! I’m a full-stack designer, which means I can handle almost everything, whether it’s creating a fresh brand, designing a smooth website, or building something totally unique. No need to hire a bunch of people, <span class='font-semibold italic'>&quot;I’m here to do it all.&quot;</span>",
        ctaPrimary = "Latest Work",
        ctaSecondary = "About Me"
    } = content || {};

    const formattedDescription = description.replace(
        /(["“']?)\s*(I’m|I'm)\s+here\s+to\s+do\s+it\s+all\.?\s*(['”"]?)/i,
        `<span class="font-semibold italic">&quot;I’m here to do it all.&quot;</span>`
    );

    return (
        <section className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
            {/* Background Scene (Stars & Glow) */}
            <div className="absolute inset-0 z-0 bg-[#08090a]">
                {/* 1. Star Field Effect */}
                <div className="absolute inset-0 opacity-40 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '48px 48px' }}></div>

                {/* 2. Hero Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
            </div>

            {/* Content */}
            <div className="z-10 flex flex-col items-center gap-8 px-4 text-center mt-[-10vh]">
                <div className="flex flex-col items-center gap-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-sm font-medium tracking-wide text-primary border border-primary/20 rounded-full px-4 py-1.5 bg-primary/10 backdrop-blur-sm"
                    >
                        {role}
                    </motion.h2>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl md:text-8xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 pb-2"
                    >
                        {name}
                    </motion.h1>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-xl md:text-2xl text-[#d0d6e0] max-w-2xl font-normal leading-relaxed text-center"
                    dangerouslySetInnerHTML={{ __html: formattedDescription }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="flex gap-4 mt-6"
                >
                    <Button size="lg" className="rounded-full h-12 px-8 btn-linear-primary font-medium text-base">
                        {ctaPrimary}
                    </Button>
                    <Button size="lg" variant="ghost" className="rounded-full h-12 px-8 text-[#d0d6e0] hover:text-white hover:bg-white/10 font-medium text-base">
                        {ctaSecondary} <span className="ml-2">→</span>
                    </Button>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-12 z-10 flex flex-col items-center gap-2"
            >
                <div className="h-16 w-[1px] bg-gradient-to-b from-transparent via-muted-foreground/50 to-transparent" />
                <span className="text-xs uppercase tracking-widest text-muted-foreground/50">Scroll</span>
            </motion.div>
        </section>
    );
}
