"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

export interface ContactContent {
    title: string;
    description: string;
    email: string;
    phone: string;
}

export function ContactSection({ content }: { content?: ContactContent }) {
    const {
        title = "Let's Connect.",
        description = "Have a project in mind? Looking for a partner to build your next big thing? Reach out.",
        email = "jeanrendy@example.com",
        phone = "+1 (555) 123-4567"
    } = content || {};

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
        resolver: zodResolver(formSchema)
    });

    const onSubmit = async (data: FormData) => {
        // Here we would send data to Firebase
        console.log("Submitting:", data);
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert("Message sent! I'll get back to you soon.");
        reset();
    };

    return (
        <section className="py-32 px-6 md:px-12 bg-background border-t border-white/5 relative overflow-hidden" id="contact">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 lg:gap-24 relative z-10">

                {/* Left: Info & Download */}
                <div className="flex-1 flex flex-col gap-10">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">{title}</h2>
                        <p className="text-lg text-muted-foreground max-w-md">
                            {description}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-semibold">Contact Details</h3>
                        <p className="text-muted-foreground">{email}</p>
                        <p className="text-muted-foreground">{phone}</p>
                    </div>

                    <div className="pt-4">
                        <Button size="lg" className="rounded-full h-12 px-8 w-fit" onClick={() => window.open('/resume.pdf', '_blank')}>
                            Download CV
                        </Button>
                    </div>
                </div>

                {/* Right: Form */}
                <div className="flex-1 max-w-lg w-full">
                    {mounted ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8 bg-muted/20 rounded-2xl border border-border/50">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Name</label>
                                <Input {...register("name")} placeholder="John Doe" />
                                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                                <Input {...register("email")} placeholder="john@example.com" />
                                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Message</label>
                                <Textarea {...register("message")} placeholder="Tell me about your project..." className="min-h-[120px]" />
                                {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
                            </div>

                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-6 p-8 bg-muted/20 rounded-2xl border border-border/50 min-h-[400px] flex items-center justify-center">
                            <p className="text-muted-foreground text-sm">Loading contact form...</p>
                        </div>
                    )}
                </div>

            </div>
        </section>
    )
}
