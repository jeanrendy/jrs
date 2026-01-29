"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
    title: string;
    description: string;
    tags: string[];
    image: string;
    href: string;
    index: number;
}

export function ProjectCard({ title, description, tags, image, href, index }: ProjectCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative flex flex-col glow-card rounded-[24px] overflow-hidden p-0"
        >
            <Link href={href} className="block w-full">
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    {/* Image Placeholder */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                    {/* In real app, use Next.js Image here */}
                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                        <span className="text-4xl font-bold opacity-10">{title[0]}</span>
                    </div>
                </div>
            </Link>

            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <Link href={href} className="group-hover:underline decoration-1 underline-offset-4">
                        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
                    </Link>
                    <Link href={href} className="opacity-0 transition-opacity group-hover:opacity-100">
                        <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                </div>
                <p className="text-muted-foreground line-clamp-2">{description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="rounded-md">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
