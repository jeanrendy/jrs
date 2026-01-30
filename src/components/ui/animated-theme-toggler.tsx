"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
    duration?: number;
}

export const AnimatedThemeToggler = ({
    className,
    duration = 400,
    ...props
}: AnimatedThemeTogglerProps) => {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    const isDark = resolvedTheme === "dark";

    const toggleTheme = useCallback(async () => {
        const newTheme = isDark ? "light" : "dark";

        // Check if View Transition API is supported
        if (!document.startViewTransition) {
            setTheme(newTheme);
            return;
        }

        await document.startViewTransition(() => {
            flushSync(() => {
                setTheme(newTheme);
            });
        }).ready;

        if (!buttonRef.current) return;

        const { top, left, width, height } =
            buttonRef.current.getBoundingClientRect();
        const x = left + width / 2;
        const y = top + height / 2;
        const maxRadius = Math.hypot(
            Math.max(left, window.innerWidth - left),
            Math.max(top, window.innerHeight - top)
        );

        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${maxRadius}px at ${x}px ${y}px)`,
                ],
            },
            {
                duration,
                easing: "ease-in-out",
                pseudoElement: "::view-transition-new(root)",
            }
        );
    }, [isDark, duration, setTheme]);

    if (!mounted) {
        return (
            <button
                className={cn(
                    "relative h-10 w-10 rounded-full flex items-center justify-center opacity-50",
                    className
                )}
                disabled
                {...props}
            >
                <Sun className="h-5 w-5 text-foreground" />
            </button>
        );
    }

    return (
        <button
            ref={buttonRef}
            onClick={toggleTheme}
            className={cn(
                "relative h-10 w-10 rounded-full transition-all hover:scale-110 active:scale-95 pointer-events-auto flex items-center justify-center",
                className
            )}
            aria-label="Toggle theme"
            {...props}
        >
            {isDark ? (
                <Moon className="h-5 w-5 text-foreground" />
            ) : (
                <Sun className="h-5 w-5 text-foreground" />
            )}
            <span className="sr-only">Toggle theme</span>
        </button>
    );
};
