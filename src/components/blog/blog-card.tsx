import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

interface BlogPostCardProps {
    title: string;
    excerpt: string;
    date: string;
    slug: string;
    category: string;
}

export function BlogPostCard({ title, excerpt, date, slug, category }: BlogPostCardProps) {
    return (
        <Link href={`/blog/${slug}`} className="block h-full group">
            <Card className="h-full transition-all duration-300 group-hover:bg-secondary/10 group-hover:border-primary/20">
                <CardHeader className="gap-2">
                    <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs font-medium rounded-full bg-primary/10 text-primary border-0">
                            {category}
                        </Badge>
                        <time className="text-xs text-muted-foreground font-mono">{date}</time>
                    </div>
                    <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors flex items-start justify-between gap-2">
                        {title}
                        <ArrowUpRight className="w-5 h-5 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 text-muted-foreground" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {excerpt}
                    </p>
                </CardContent>
            </Card>
        </Link>
    );
}
