"use client";

import { Globe } from "@/components/ui/globe";

interface Marker {
    lat: number;
    lng: number;
    label: string;
}

export function GlobeBackground({ markers }: { markers?: Marker[] }) {
    // Convert markers to Globe format
    const globeMarkers = markers?.map(m => ({
        location: [m.lat, m.lng] as [number, number],
        size: 0.1
    })) || [];

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-full h-full">
                <Globe
                    className="opacity-40"
                    config={{
                        phi: 0,
                        theta: 0.3,
                        dark: 1,
                        diffuse: 1.2,
                        mapSamples: 16000,
                        mapBrightness: 6,
                        baseColor: [0.3, 0.3, 0.3],
                        markerColor: [1, 1, 1],
                        glowColor: [1, 1, 1],
                        markers: globeMarkers,
                        scale: 1,
                        offset: [0, 0],
                    }}
                />

            </div>
        </div>
    );
}
