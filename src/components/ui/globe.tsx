"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface GlobeProps {
    className?: string;
    config?: {
        width?: number;
        height?: number;
        devicePixelRatio?: number;
        phi?: number;
        theta?: number;
        dark?: number;
        diffuse?: number;
        mapSamples?: number;
        mapBrightness?: number;
        baseColor?: [number, number, number];
        markerColor?: [number, number, number];
        glowColor?: [number, number, number];
        markers?: Array<{ location: [number, number]; size: number }>;
        scale?: number;
        offset?: [number, number];
    };
}

export function Globe({ className, config = {} }: GlobeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointerInteracting = useRef<number | null>(null);
    const pointerInteractionMovement = useRef(0);
    const phiRef = useRef(0);

    useEffect(() => {
        let width = 0;
        const onResize = () => {
            if (canvasRef.current) {
                width = canvasRef.current.offsetWidth;
            }
        };
        window.addEventListener("resize", onResize);
        onResize();

        if (!canvasRef.current) return;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: width * 2,
            height: width * 2,
            phi: config.phi || 0,
            theta: config.theta || 0.3,
            dark: config.dark ?? 1,
            diffuse: config.diffuse ?? 1.2,
            mapSamples: config.mapSamples ?? 16000,
            mapBrightness: config.mapBrightness ?? 6,
            baseColor: config.baseColor || [0.3, 0.3, 0.3],
            markerColor: config.markerColor || [0.8, 1, 0],
            glowColor: config.glowColor || [0.8, 1, 0],
            markers: config.markers || [],
            scale: config.scale ?? 1,
            offset: config.offset || [0, 0],
            onRender: (state) => {
                // Auto-rotate
                if (!pointerInteracting.current) {
                    phiRef.current += 0.005;
                }
                state.phi = phiRef.current + pointerInteractionMovement.current;
                state.width = width * 2;
                state.height = width * 2;
            },
        });

        setTimeout(() => {
            if (canvasRef.current) {
                canvasRef.current.style.opacity = "1";
            }
        });

        return () => {
            globe.destroy();
            window.removeEventListener("resize", onResize);
        };
    }, [config]);

    return (
        <canvas
            ref={canvasRef}
            className={cn("h-full w-full opacity-0 transition-opacity duration-500", className)}
            style={{
                width: "100%",
                height: "100%",
                maxWidth: "100%",
                aspectRatio: "1",
            }}
        />
    );
}
