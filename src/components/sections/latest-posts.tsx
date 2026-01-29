"use client";

import { BlogPostCard } from "@/components/blog/blog-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const posts = [
    {
        title: "The Future of Web Development with AI",
        excerpt: "How generative AI is streamlining workflows for creative developers and changing the landscape of 3D on the web.",
        date: "Oct 12, 2023",
        slug: "future-of-web-ai",
        category: "Tech"
    },
    {
        title: "Mastering React Three Fiber",
        excerpt: "A deep dive into performance optimization and scene management for complex 3D web applications.",
        date: "Sep 28, 2023",
        slug: "mastering-r3f",
        category: "Tutorial"
    },
    {
        title: "Why Minimalist Design Wins",
        excerpt: "Exploring the psychology behind minimalist interfaces and why they often convert better.",
        date: "Aug 15, 2023",
        slug: "minimalist-design",
        category: "Design"
    }
];

export interface BlogContent {
    title: string;
    description: string;
}

export function LatestPosts({ content }: { content?: BlogContent }) {
    const {
        title = "Recent Writing.",
        description = "Thoughts on design, creative coding, and the future of web."
    } = content || {};

    return (
        <section className="py-32 px-6 md:px-12 border-t border-white/5 bg-background relative" id="blog">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

            <div className="max-w-7xl mx-auto flex flex-col gap-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6"
                >
                    <div className="flex flex-col gap-2">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">{title}</h2>
                        <p className="text-lg text-muted-foreground max-w-xl">
                            {description}
                        </p>
                    </div>
                    <Button variant="ghost" asChild className="group text-lg font-medium">
                        <Link href="/blog">
                            Read all posts
                            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </Button>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {posts.map((post, i) => (
                        <motion.div
                            key={post.slug}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <BlogPostCard {...post} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
