"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, MotionValue } from "framer-motion";

interface TextPressureProps {
    text: string;
    fontFamily?: string;
    className?: string;
    textColor?: string;
    strokeColor?: string;
    strokeWidth?: boolean;
    minFontSize?: number;
    weight?: boolean;
    italic?: boolean;
    alpha?: boolean;
    flex?: boolean;
    width?: boolean;
}

export function TextPressure({
    text = "Compress",
    fontFamily = "",
    className = "",
    textColor = "#FFFFFF",
    strokeColor = "#FF0000",
    strokeWidth = false,
    minFontSize = 24,
    weight = true,
    italic = true,
    alpha = false,
    flex = true,
    width = true,
}: TextPressureProps) {
    const containerRef = useRef<HTMLHeadingElement>(null);
    const titleRef = useRef<HTMLSpanElement>(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const [titleSize, setTitleSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    useEffect(() => {
        if (titleRef.current) {
            setTitleSize({
                width: titleRef.current.offsetWidth,
                height: titleRef.current.offsetHeight,
            });
        }
    }, []);

    return (
        <h1
            ref={containerRef}
            className={`relative w-full h-full flex items-center justify-center ${className} ${flex ? "flex" : ""}`}
            style={{ fontFamily }}
        >
            <span
                ref={titleRef}
                className="relative block"
                style={{
                    fontSize: minFontSize,
                    color: textColor,
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                }}
            >
                {text.split("").map((char, i) => (
                    <TextPressureItem
                        key={i}
                        text={char}
                        index={i}
                        mouseX={mouseX}
                        mouseY={mouseY}
                        parentRef={titleRef}
                        weight={weight}
                        width={width}
                        italic={italic}
                        alpha={alpha}
                        textColor={textColor}
                        strokeColor={strokeColor}
                        strokeWidth={strokeWidth}
                        minFontSize={minFontSize}
                    />
                ))}
            </span>
        </h1>
    );
}

function TextPressureItem({
    text,
    index,
    mouseX,
    mouseY,
    parentRef,
    weight,
    width,
    italic,
    alpha,
    textColor,
    strokeColor,
    strokeWidth,
    minFontSize
}: {
    text: string;
    index: number;
    mouseX: MotionValue<number>;
    mouseY: MotionValue<number>;
    parentRef: React.RefObject<HTMLSpanElement | null>;
    weight: boolean;
    width: boolean;
    italic: boolean;
    alpha: boolean;
    textColor: string;
    strokeColor: string;
    strokeWidth: boolean;
    minFontSize: number;
}) {
    const itemRef = useRef<HTMLSpanElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [styles, setStyles] = useState<any>({});

    useEffect(() => {
        const updateStyles = () => {
            if (!itemRef.current || !parentRef.current) return;

            const rect = itemRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const mX = mouseX.get();
            const mY = mouseY.get();

            const dist = Math.sqrt(
                Math.pow(mX - centerX, 2) + Math.pow(mY - centerY, 2)
            );

            // Max distance interaction
            const maxDist = 400;
            const fade = Math.max(0, 1 - dist / maxDist); // 0 to 1 (1 is close)

            const targetWeight = weight ? 100 + (fade * 800) : 400;
            const targetScaleX = width ? 1 + (fade * 0.5) : 1;
            const targetSkew = italic ? (fade * -10) : 0;
            const targetOpacity = alpha ? 0.3 + (fade * 0.7) : 1;

            setStyles({
                fontWeight: Math.round(targetWeight),
                transform: `scaleX(${targetScaleX}) skewX(${targetSkew}deg)`,
                opacity: targetOpacity,
                ...(strokeWidth && {
                    WebkitTextStroke: `${fade * 2}px ${strokeColor}`,
                    color: fade > 0.5 ? "transparent" : textColor
                })
            });
        };

        // Subscribe to changes
        const unsubscribeX = mouseX.on("change", updateStyles);
        const unsubscribeY = mouseY.on("change", updateStyles);

        // Initial update
        updateStyles();

        return () => {
            unsubscribeX();
            unsubscribeY();
        };
    }, [mouseX, mouseY, weight, width, italic, alpha, textColor, strokeColor, strokeWidth, parentRef]);

    return (
        <span
            ref={itemRef}
            className="inline-block transition-all duration-200 ease-out will-change-transform"
            style={styles}
        >
            {text}
        </span>
    );
}
