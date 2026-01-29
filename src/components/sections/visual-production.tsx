"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Volume2, VolumeX, Maximize, Info, X, Play, Pause } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface MediaData {
    id: number | string;
    src: string;
    type: "video" | "image";
    alt?: string;
}

interface VisualProductionProps {
    mediaItems: MediaData[];
    className?: string;
}

const VideoDetailsModal = ({ video, onClose }: { video: MediaData | null, onClose: () => void }) => {
    if (!video) return null;
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative bg-neutral-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        <X size={20} className="text-white" />
                    </button>
                    <h3 className="text-2xl font-bold text-white mb-2">Video Details</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-400">File Name</p>
                            <p className="text-white break-all">{video.alt || video.src.split('/').pop()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Source</p>
                            <p className="text-xs text-white/70 font-mono break-all bg-black/30 p-2 rounded">{video.src}</p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const VolumeControl = ({
    isMuted,
    volume,
    onToggleMute,
    onVolumeChange
}: {
    isMuted: boolean,
    volume: number,
    onToggleMute: () => void,
    onVolumeChange: (val: number) => void
}) => {
    return (
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 h-9 md:h-10 transition-colors hover:bg-white/20 group/vol">
            <button
                onClick={(e) => { e.stopPropagation(); onToggleMute(); }}
                className="text-white hover:text-white/80 transition-colors flex-shrink-0"
            >
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <div className="w-0 group-hover/vol:w-20 transition-[width] duration-300 overflow-hidden flex items-center">
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                        e.stopPropagation();
                        onVolumeChange(parseFloat(e.target.value));
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                />
            </div>
        </div>
    );
};

interface CardState {
    muted: boolean;
    volume: number;
    playing: boolean;
}

const StickyCard002 = ({
    mediaItems,
    className,
}: VisualProductionProps) => {
    const container = useRef(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Independent state for each card
    const [cardStates, setCardStates] = useState<CardState[]>([]);

    const activeIndexRef = useRef(0);
    const [selectedVideo, setSelectedVideo] = useState<MediaData | null>(null);

    // Initialize states when items load
    useEffect(() => {
        if (mediaItems.length > 0 && cardStates.length !== mediaItems.length) {
            setCardStates(new Array(mediaItems.length).fill({ muted: true, volume: 1, playing: false }));
        }
    }, [mediaItems, cardStates.length]);

    useGSAP(
        () => {
            gsap.registerPlugin(ScrollTrigger);

            // Clean up filters
            const cardElements = cardRefs.current.filter(el => el !== null);
            const totalCards = cardElements.length;

            if (totalCards === 0) return;

            // Set initial state
            cardElements.forEach((el, index) => {
                if (index === 0) {
                    gsap.set(el, { y: "0%", scale: 1, rotation: 0 });
                } else {
                    gsap.set(el, { y: "100%", scale: 1, rotation: 0 });
                }
            });

            // Ensure first video plays
            const firstVideo = cardElements[0].querySelector('video');
            if (firstVideo) {
                firstVideo.play().catch(() => { });
            }

            const scrollTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: ".sticky-cards-visual",
                    start: "center center",
                    end: `+=${window.innerHeight * (totalCards - 1)}`,
                    pin: true,
                    scrub: 0.5,
                    pinSpacing: true,
                    onLeave: () => {
                        cardElements.forEach(el => {
                            const v = el?.querySelector('video');
                            if (v) {
                                v.pause();
                                // Sync state? play/pause listeners handle it.
                            }
                        });
                    },
                    onLeaveBack: () => {
                        cardElements.forEach(el => {
                            const v = el?.querySelector('video');
                            if (v) v.pause();
                        });
                    },
                    onEnter: () => {
                        const idx = activeIndexRef.current;
                        const v = cardElements[idx]?.querySelector('video');
                        if (v) v.play().catch(() => { });
                    },
                    onEnterBack: () => {
                        const idx = activeIndexRef.current;
                        const v = cardElements[idx]?.querySelector('video');
                        if (v) v.play().catch(() => { });
                    },
                    onUpdate: (self) => {
                        const progress = self.progress;
                        const rawIndex = progress * (totalCards - 1);
                        const newIndex = Math.round(rawIndex);

                        if (newIndex !== activeIndexRef.current && newIndex >= 0 && newIndex < totalCards) {
                            activeIndexRef.current = newIndex;
                            cardElements.forEach((el, idx) => {
                                const video = el.querySelector('video');
                                if (video) {
                                    if (idx === newIndex) {
                                        video.play().catch(() => { });
                                    } else {
                                        video.pause();
                                    }
                                }
                            });
                        }
                    }
                },
            });

            for (let i = 0; i < totalCards - 1; i++) {
                const currentCard = cardElements[i];
                const nextCard = cardElements[i + 1];
                const position = i;
                const currentInner = currentCard.querySelector('.visual-card');

                scrollTimeline.to(
                    currentCard,
                    {
                        scale: 0.7,
                        rotation: 5,
                        opacity: 0.6,
                        duration: 1,
                        ease: "none",
                    },
                    position,
                );

                if (currentInner) {
                    scrollTimeline.to(
                        currentInner,
                        {
                            boxShadow: "none",
                            duration: 1,
                            ease: "none",
                        },
                        position
                    );
                }

                scrollTimeline.to(
                    nextCard,
                    {
                        y: "0%",
                        duration: 1,
                        ease: "none",
                    },
                    position,
                );
            }

            ScrollTrigger.refresh();

            return () => {
                scrollTimeline.kill();
            };
        },
        { scope: container, dependencies: [mediaItems] }
    );

    const toggleFullscreen = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        const cardWrapper = cardRefs.current[index];
        const visualCard = cardWrapper?.querySelector('.visual-card');
        if (visualCard) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                visualCard.requestFullscreen().catch(err => console.error(err));
            }
        }
    };

    const togglePlay = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        const card = cardRefs.current[index];
        const video = card?.querySelector('video');
        if (video) {
            if (video.paused) video.play().catch(() => { });
            else video.pause();
        }
    };

    const updateCardState = (index: number, newState: Partial<CardState>) => {
        setCardStates(prev => {
            const next = [...prev];
            next[index] = { ...next[index], ...newState };
            return next;
        });
        // Apply to DOM if needed for mutable props (volume/muted), 
        // but 'playing' is read-only on DOM (use play()/pause() methods). 
        // Listeners sync state.
        const card = cardRefs.current[index];
        const video = card?.querySelector('video');
        if (video) {
            if (newState.muted !== undefined) video.muted = newState.muted;
            if (newState.volume !== undefined) video.volume = newState.volume;
        }
    };

    const handleGlobalToggle = () => {
        const activeIdx = activeIndexRef.current;
        const currentActiveMuted = cardStates[activeIdx]?.muted ?? true;
        const targetMuted = !currentActiveMuted;

        setCardStates(prev => prev.map(s => ({ ...s, muted: targetMuted })));

        cardRefs.current.forEach(card => {
            const video = card?.querySelector('video');
            if (video) {
                video.muted = targetMuted;
            }
        });
    };

    // Helper to get active mute state for the global button label
    const activeMuted = cardStates[activeIndexRef.current]?.muted ?? true;

    return (
        <>
            <div className={cn("relative h-full w-full", className)} ref={container}>
                <div className="sticky-cards-visual relative flex h-[100dvh] w-full items-center justify-center overflow-hidden p-3 lg:p-8">


                    {/* Main Stack Container - fixed height to viewport */}
                    <div className="relative w-full h-full max-w-7xl flex items-center justify-center">

                        <div className="absolute top-8 left-6 z-40 flex flex-col items-center md:items-start text-center md:text-left">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-white">Visual Productions</h2>
                            <p className="text-lg text-gray-400 max-w-2xl">
                                Motion graphics, video editing, and visual storytelling.
                            </p>
                        </div>

                        {mediaItems.map((item, i) => {
                            const state = cardStates[i] || { muted: true, volume: 1, playing: false };

                            return (
                                <div
                                    key={item.id}
                                    className="absolute inset-0 flex items-center justify-center will-change-transform"
                                    ref={(el) => { cardRefs.current[i] = el; }}
                                >
                                    {/* THE VISUAL CARD - Adapts to content size */}
                                    <div className="visual-card relative max-h-[85dvh] max-w-full shadow-[0_35px_60px_-15px_rgba(0,0,0,0.8)] rounded-3xl overflow-hidden group bg-neutral-900 border border-white/10 mx-4">

                                        {item.type === "video" ? (
                                            <video
                                                src={item.src}
                                                className="max-h-[85dvh] w-auto max-w-full object-contain cursor-pointer"
                                                muted={state.muted}
                                                loop
                                                playsInline
                                                suppressHydrationWarning
                                                onPlay={() => updateCardState(i, { playing: true })}
                                                onPause={() => updateCardState(i, { playing: false })}
                                                onClick={(e) => togglePlay(e, i)}
                                            />
                                        ) : (
                                            <img
                                                src={item.src}
                                                alt={item.alt || ""}
                                                className="max-h-[85dvh] w-auto max-w-full object-contain"
                                            />
                                        )}

                                        {/* Controls Overlay */}
                                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                            {/* Left Controls: Info - DISABLED for now */}
                                            {/* 
                                            <div className="flex gap-2 pointer-events-auto">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedVideo(item); }}
                                                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
                                                    title="Info"
                                                >
                                                    <Info size={18} />
                                                </button>
                                            </div> 
                                            */}

                                            {/* Right Controls: Play/Pause, Volume, Fullscreen */}
                                            <div className="flex items-center gap-2 pointer-events-auto">
                                                {item.type === 'video' && (
                                                    <>
                                                        <button
                                                            onClick={(e) => togglePlay(e, i)}
                                                            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
                                                            title={state.playing ? "Pause" : "Play"}
                                                        >
                                                            {state.playing ? <Pause size={18} /> : <Play size={18} />}
                                                        </button>

                                                        <VolumeControl
                                                            isMuted={state.muted}
                                                            volume={state.volume}
                                                            onToggleMute={() => updateCardState(i, { muted: !state.muted })}
                                                            onVolumeChange={(val) => updateCardState(i, { volume: val, muted: val === 0 })}
                                                        />
                                                        <button
                                                            onClick={(e) => toggleFullscreen(e, i)}
                                                            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
                                                            title="Fullscreen"
                                                        >
                                                            <Maximize size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Global Floating Audio Toggle */}
                        <button
                            onClick={(e) => { e.stopPropagation(); handleGlobalToggle(); }}
                            className="absolute top-8 right-6 z-[60] p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-black/70 transition-colors shadow-2xl cursor-pointer pointer-events-auto"
                            aria-label="Toggle All Videos Audio"
                        >
                            {activeMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {selectedVideo && (
                <VideoDetailsModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
            )}
        </>
    );
};

export const VisualProductionShowcase = () => {
    const [videos, setVideos] = useState<MediaData[]>([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch('/api/visual-production-videos');
                const data = await response.json();
                if (Array.isArray(data)) {
                    setVideos(data);
                }
            } catch (error) {
                console.error("Error fetching videos:", error);
            }
        };

        fetchVideos();
    }, []);

    if (videos.length === 0) return null;

    return (
        <section className="min-h-screen w-full bg-background relative z-20 pb-20 pt-20">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >

                <StickyCard002 mediaItems={videos} />
            </motion.div>
        </section>
    );
};
