"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ExpandableCardProps {
    title: string;
    description: string;
    src: string;
    children: React.ReactNode;
    className?: string;
    classNameExpanded?: string;
}

export function ExpandableCard({
    title,
    description,
    src,
    children,
    className,
    classNameExpanded,
}: ExpandableCardProps) {
    const [active, setActive] = useState<boolean>(false);
    const id = useId();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setActive(false);
            }
        }

        if (active) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [active]);

    useOutsideClick(ref, () => setActive(false));

    return (
        <>
            <AnimatePresence>
                {active && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 h-full w-full z-10"
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {active ? (
                    <div className="fixed inset-0 grid place-items-center z-[100]">
                        <motion.button
                            key={`button-${title}-${id}`}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.05 } }}
                            className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
                            onClick={() => setActive(false)}
                        >
                            <X className="text-black w-4 h-4" />
                        </motion.button>
                        <motion.div
                            layoutId={`card-${title}-${id}`}
                            ref={ref}
                            className={cn(
                                "w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden",
                                classNameExpanded
                            )}
                        >
                            <motion.div layoutId={`image-${title}-${id}`}>
                                <Image
                                    priority
                                    width={500}
                                    height={500}
                                    src={src}
                                    alt={title}
                                    className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                                />
                            </motion.div>

                            <div>
                                <div className="flex justify-between items-start p-4">
                                    <div className="">
                                        <motion.h3
                                            layoutId={`title-${title}-${id}`}
                                            className="font-medium text-neutral-700 dark:text-neutral-200 text-base"
                                        >
                                            {title}
                                        </motion.h3>
                                        <motion.p
                                            layoutId={`description-${description}-${id}`}
                                            className="text-neutral-600 dark:text-neutral-400 text-base"
                                        >
                                            {description}
                                        </motion.p>
                                    </div>

                                    <motion.a
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        href="#" // You might want to make this a prop later
                                        target="_blank"
                                        className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                                    >
                                        View Case
                                    </motion.a>
                                </div>
                                <div className="pt-4 relative px-4 pb-4">
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400"
                                    >
                                        {children}
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ) : null}
            </AnimatePresence>
            <motion.div
                layoutId={`card-${title}-${id}`}
                onClick={() => setActive(true)}
                className={cn(
                    "p-4 flex flex-col hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer",
                    className
                )}
            >
                <div className="flex gap-4 flex-col w-full">
                    <motion.div layoutId={`image-${title}-${id}`}>
                        <Image
                            width={500}
                            height={500}
                            src={src}
                            alt={title}
                            className="h-60 w-full rounded-lg object-cover object-top"
                        />
                    </motion.div>
                    <div className="flex justify-center items-center flex-col">
                        <motion.h3
                            layoutId={`title-${title}-${id}`}
                            className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-base"
                        >
                            {title}
                        </motion.h3>
                        <motion.p
                            layoutId={`description-${description}-${id}`}
                            className="text-neutral-600 dark:text-neutral-400 text-center md:text-left text-base"
                        >
                            {description}
                        </motion.p>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
