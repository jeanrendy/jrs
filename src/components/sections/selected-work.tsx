"use client";
import { ProjectCard } from "@/components/portfolio/project-card";

const projects = [
    {
        title: "E-Commerce Rebrand",
        description: "A complete overhaul of a fashion retailer's online presence, focusing on performance and 3D product view.",
        tags: ["Next.js", "Shopify", "WebGL"],
        image: "/project1.jpg",
        href: "/work/ecommerce-rebrand",
    },
    {
        title: "Fintech Dashboard",
        description: "Real-time financial data visualization platform with complex charts and secure transactions.",
        tags: ["React", "D3.js", "TypeScript"],
        image: "/project2.jpg",
        href: "/work/fintech-dashboard",
    },
    {
        title: "AI Chat Interface",
        description: "Generative AI chat application with streaming responses and markdown support.",
        tags: ["OpenAI", "Tailwind", "Vercel SDK"],
        image: "/project3.jpg",
        href: "/work/ai-chat",
    },
    {
        title: "Portfolio 2024",
        description: "My personal portfolio website featuring 3D animations and headless CMS integration.",
        tags: ["R3F", "GSAP", "Firebase"],
        image: "/project4.jpg",
        href: "/work/portfolio",
    },
];

export interface PortfolioContent {
    title: string;
    description: string;
}

export function SelectedWork({ content }: { content?: PortfolioContent }) {
    const {
        title = "Selected Work.",
        description = "A collection of projects where design meets code. Focusing on user experience and performance."
    } = content || {};

    return (
        <section className="py-32 px-6 md:px-12 bg-background relative" id="work">
            <div className="max-w-7xl mx-auto flex flex-col gap-16">
                <div className="flex flex-col gap-4">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">{title}</h2>
                    <p className="max-w-xl text-lg text-muted-foreground">
                        {description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
                    {projects.map((project, index) => (
                        <ProjectCard key={project.title} {...project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
