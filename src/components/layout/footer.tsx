"use client";

import { ArrowUpRight, Instagram, Linkedin, Twitter, Globe, Github } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Marquee } from "@/components/ui/marquee";



export function Footer() {
    const [mounted, setMounted] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', message: '' });

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <footer id="footer" className="fixed bottom-0 left-0 w-full md:h-[800px] bg-black text-white -z-10 flex flex-col justify-end overflow-hidden font-sans">
            {/* Content Container */}
            <div className="container mx-auto px-6 h-full flex flex-col pt-48 md:pt-[200px] pb-20 relative z-10 gap-10 justify-start">

                {/* Main Section */}
                <div className="flex flex-col md:flex-row justify-between w-full gap-12 lg:gap-24">

                    {/* Left Column */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-medium mb-2">Let&apos;s Talk</h3>
                                <p className="text-gray-400 max-w-md text-lg leading-relaxed">
                                    Have a project in mind? Looking for a partner to build your next big thing? Reach out.
                                </p>
                            </div>

                            <a
                                href="mailto:jeanrendy@gmail.com"
                                className="text-4xl md:text-5xl lg:text-7xl font-bold flex items-center gap-4 hover:text-[#CCFF00] transition-colors tracking-tight group"
                            >
                                jeanrendy@gmail.com
                                <ArrowUpRight className="w-8 h-8 md:w-12 md:h-12 group-hover:rotate-45 transition-transform duration-300" />
                            </a>
                        </div>

                        {/* Divider & Marquee */}
                        <div className="w-full mt-auto hidden md:block">
                            <div className="w-full h-px bg-white/10 mb-8" />
                            <div className="relative w-full overflow-hidden">
                                <div className="absolute top-0 left-0 w-32 h-full z-10 bg-gradient-to-r from-black to-transparent pointer-events-none" />
                                <div className="absolute top-0 right-0 w-32 h-full z-10 bg-gradient-to-l from-black to-transparent pointer-events-none" />
                                <Marquee className="py-2" pauseOnHover>
                                    <div className="flex items-center gap-6 mx-8">
                                        <span className="text-6xl md:text-8xl font-bold tracking-tighter whitespace-nowrap">Let&apos;s Cut The BS</span>
                                        <img src="/assets/bs.png" alt="BS" className="h-16 md:h-24 w-auto object-contain" />
                                    </div>
                                    <div className="flex items-center gap-6 mx-8 opacity-50">
                                        <span className="text-6xl md:text-8xl font-bold tracking-tighter whitespace-nowrap">Let&apos;s Cut The BS</span>
                                        <img src="/assets/bs.png" alt="BS" className="h-16 md:h-24 w-auto object-contain" />
                                    </div>
                                </Marquee>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Form) */}
                    <div className="w-full md:w-[40%] shrink-0">
                        {mounted ? (
                            <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6 h-full flex flex-col justify-center">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium text-gray-400">Name</label>
                                        <Input id="name" placeholder="John Doe" className="bg-black/50 border-white/10 h-12 rounded-lg focus-visible:ring-1 focus-visible:ring-[#CCFF00] placeholder:text-gray-600" onChange={(e) => setForm({ ...form, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium text-gray-400">Email</label>
                                        <Input id="email" placeholder="john@example.com" className="bg-black/50 border-white/10 h-12 rounded-lg focus-visible:ring-1 focus-visible:ring-[#CCFF00] placeholder:text-gray-600" onChange={(e) => setForm({ ...form, email: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-sm font-medium text-gray-400">Message</label>
                                        <Textarea id="message" placeholder="Tell me about your project..." className="bg-black/50 border-white/10 min-h-[100px] rounded-lg resize-none focus-visible:ring-1 focus-visible:ring-[#CCFF00] placeholder:text-gray-600" onChange={(e) => setForm({ ...form, message: e.target.value })} />
                                    </div>
                                </div>
                                <Button
                                    className="w-full h-12 bg-[#CCFF00] text-black hover:bg-[#bbe600] font-bold rounded-lg text-base transition-colors"
                                    onClick={() => {
                                        window.location.href = `mailto:jeanrendy@gmail.com?subject=Contact form submission from ${form.name}&body=Name: ${form.name}%0D%0AEmail: ${form.email}%0D%0AMessage: ${form.message}`;
                                    }}
                                >
                                    Send Message
                                </Button>
                            </div>
                        ) : (
                            <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6 h-full flex flex-col justify-center min-h-[400px] animate-pulse">
                                {/* Skeleton placeholder to prevent layout shift */}
                                <div className="space-y-4">
                                    <div className="h-16 bg-white/5 rounded-lg" />
                                    <div className="h-16 bg-white/5 rounded-lg" />
                                    <div className="h-32 bg-white/5 rounded-lg" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="w-full flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 mt-8 lg:mt-0">
                    <p className="text-gray-500 text-sm">Jrs © {new Date().getFullYear()}</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        {[
                            { src: "/assets/socmed/upwork.svg", href: "https://www.upwork.com/freelancers/jeanrendy", alt: "Upwork" },
                            { src: "/assets/socmed/linkedin.svg", href: "https://www.linkedin.com/in/jeanrendy/", alt: "LinkedIn" },
                            { src: "/assets/socmed/behance.svg", href: "https://www.behance.net/jeanrendy", alt: "Behance" },
                            { src: "/assets/socmed/github.svg", href: "https://github.com/jeanrendy", alt: "Github" },
                            { src: "/assets/socmed/instagram.svg", href: "https://www.instagram.com/jeanrendy/", alt: "Instagram" }
                        ].map(({ src, href, alt }, i) => (
                            <Link key={i} href={href} target="_blank" rel="noopener noreferrer" className="p-3 bg-black rounded-full border border-white/10 hover:border-white hover:bg-white/10 transition-all duration-300 group hover:scale-110">
                                <img src={src} alt={alt} className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity brightness-0 invert" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
