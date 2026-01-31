"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Volume2, VolumeX, Maximize, Info, X, Play, Pause } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCursor } from "@/context/cursor-context";

interface MediaData {
    id: number | string;
    src: string;
    type: "video" | "image";
    alt?: string;
    title?: string;
    year?: string;
    category?: string;
    brandCategories?: string[];
    insight?: string;
    description?: string;
    services?: string[];
    tools?: string[];
    caseStudyUrl?: string;
    liveWebsiteUrl?: string;
}

interface VisualProductionProps {
    mediaItems: MediaData[];
    className?: string;
}

const VideoDetailsModal = ({ video, onClose }: { video: MediaData | null, onClose: () => void }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => setIsPlaying(false));
            videoRef.current.volume = volume;
            videoRef.current.muted = isMuted;
        }
    }, [video, volume, isMuted]);

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            const newMuted = !isMuted;
            videoRef.current.muted = newMuted;
            setIsMuted(newMuted);
            if (!newMuted && volume === 0) {
                setVolume(1);
                videoRef.current.volume = 1;
            }
        }
    };

    const handleVolumeChange = (newVolume: number) => {
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
            videoRef.current.muted = newVolume === 0;
        }
    };

    if (!video) return null;
    return (
        <AnimatePresence>
            <div className="fixed inset-0 grid place-items-center z-[100] p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm h-full w-full z-0"
                    onClick={onClose}
                />

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                    <video
                        src={video.src}
                        className="w-[80vw] h-[80vh] object-cover blur-[100px] opacity-40 scale-110"
                        muted loop playsInline autoPlay
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-full max-w-[90vw] md:max-w-[800px] h-[85vh] md:h-fit md:max-h-[90vh] flex flex-col bg-[#111111] sm:rounded-3xl overflow-hidden shadow-2xl z-10 relative cursor-none border border-white/10"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full z-50 backdrop-blur-md transition-colors cursor-none"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>

                    <div className="relative h-64 md:h-96 w-full flex-shrink-0 bg-black group relative">
                        <video
                            ref={videoRef}
                            src={video.src}
                            className="w-full h-full object-cover"
                            muted={isMuted}
                            loop
                            playsInline
                            onClick={togglePlay}
                        />
                        <div className="absolute inset-0 bg-black/10 pointer-events-none" />

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                                onClick={togglePlay}
                                className="text-white hover:text-white/80 transition-colors"
                            >
                                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                            </button>

                            <VolumeControl
                                isMuted={isMuted}
                                volume={volume}
                                onToggleMute={toggleMute}
                                onVolumeChange={handleVolumeChange}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col p-6 md:p-8 overflow-y-auto bg-[#111111] text-white h-full">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
                            <div>
                                <p className="text-sm font-medium text-gray-400 mb-1">{video.year || "2024"}</p>
                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">
                                    {video.title || video.alt || "Visual Project"}
                                </h3>
                                <p className="text-lg text-gray-400 italic">
                                    {video.brandCategories && video.brandCategories.length > 0
                                        ? video.brandCategories.join(" / ")
                                        : video.category || "Visual Production & Motion"}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                {video.caseStudyUrl && (
                                    <a
                                        href={video.caseStudyUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium cursor-none"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Case Study
                                    </a>
                                )}
                                {video.liveWebsiteUrl && (
                                    <a
                                        href={video.liveWebsiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#CCFF00] text-black hover:bg-[#b3e600] transition-colors text-sm font-medium cursor-none"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        View Live
                                    </a>
                                )}
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            <div>
                                <h4 className="text-xl font-bold text-white mb-3">Project Insight</h4>
                                <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
                                    {video.insight
                                        ? video.insight
                                        : video.description || "A cinematic exploration of visual storytelling. This project highlights the intersection of motion, sound, and brand narrative."}
                                </p>
                            </div>

                            {video.services && video.services.length > 0 && (
                                <div className="flex flex-wrap gap-3 mt-6">
                                    {video.services.map((tag) => (
                                        <span key={tag} className="px-5 py-2 rounded-full bg-white/5 text-gray-300 text-sm border border-white/10">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {video.tools && video.tools.length > 0 && (
                                <div className="mt-8 border-t border-white/10 pt-6">
                                    <h5 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Tools Used</h5>
                                    <div className="flex flex-wrap gap-4">
                                        {video.tools.map((tool) => {
                                            const isUrl = tool.startsWith("http");
                                            return (
                                                <div key={tool} className="relative w-10 h-10 group" title={tool.replace(".png", "")}>
                                                    <div className="absolute inset-0 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors" />
                                                    <div className="relative w-full h-full p-2">
                                                        <img
                                                            src={isUrl ? tool : `/assets/minilog/${tool}`}
                                                            alt={tool}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
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
    const { setCursorType } = useCursor();

    // Independent state for each card
    const [cardStates, setCardStates] = useState<CardState[]>([]);

    const activeIndexRef = useRef(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedVideo, setSelectedVideo] = useState<MediaData | null>(null);
    const [fullscreenVideo, setFullscreenVideo] = useState<MediaData | null>(null);

    // Initialize states when items load
    useEffect(() => {
        if (mediaItems.length > 0 && cardStates.length !== mediaItems.length) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCardStates(new Array(mediaItems.length).fill({ muted: true, volume: 1, playing: false }));
        }
    }, [mediaItems, cardStates.length]);

    // Pause main videos when modal or fullscreen is open
    useEffect(() => {
        const cardElements = cardRefs.current?.filter(el => el !== null);
        if (!cardElements) return;

        if (selectedVideo || fullscreenVideo) {
            // Pause all
            cardElements.forEach(el => el?.querySelectorAll('video').forEach(v => v.pause()));
        } else {
            // Resume active
            const activeEl = cardElements[activeIndex];
            activeEl?.querySelectorAll('video').forEach(v => v.play().catch(() => { }));
        }
    }, [selectedVideo, fullscreenVideo, activeIndex]);

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
                            el?.querySelectorAll('video').forEach(v => v.pause());
                        });
                    },
                    onLeaveBack: () => {
                        cardElements.forEach(el => {
                            el?.querySelectorAll('video').forEach(v => v.pause());
                        });
                    },
                    onEnter: () => {
                        const idx = activeIndexRef.current;
                        cardElements[idx]?.querySelectorAll('video').forEach(v => v.play().catch(() => { }));
                    },
                    onEnterBack: () => {
                        const idx = activeIndexRef.current;
                        cardElements[idx]?.querySelectorAll('video').forEach(v => v.play().catch(() => { }));
                    },
                    onUpdate: (self) => {
                        const progress = self.progress;
                        const rawIndex = progress * (totalCards - 1);
                        const newIndex = Math.round(rawIndex);

                        if (newIndex !== activeIndexRef.current && newIndex >= 0 && newIndex < totalCards) {
                            activeIndexRef.current = newIndex;
                            setActiveIndex(newIndex);
                            cardElements.forEach((el, idx) => {
                                const videos = el.querySelectorAll('video');
                                if (videos.length > 0) {
                                    if (idx === newIndex) {
                                        videos.forEach(v => v.play().catch(() => { }));
                                    } else {
                                        videos.forEach(v => v.pause());
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
        const videos = card?.querySelectorAll('video');
        videos?.forEach(video => {
            if (video.paused) video.play().catch(() => { });
            else video.pause();
        });
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
        const videos = card?.querySelectorAll('video');
        videos?.forEach(video => {
            if (newState.muted !== undefined) video.muted = newState.muted;
            if (newState.volume !== undefined) video.volume = newState.volume;
        });
    };

    const handleGlobalToggle = () => {
        const activeIdx = activeIndexRef.current;
        const currentActiveMuted = cardStates[activeIdx]?.muted ?? true;
        const targetMuted = !currentActiveMuted;

        setCardStates(prev => prev.map(s => ({ ...s, muted: targetMuted })));

        cardRefs.current.forEach(card => {
            card?.querySelectorAll('video').forEach(video => {
                video.muted = targetMuted;
            });
        });
    };

    // Helper to get active mute state for the global button label
    const activeMuted = cardStates[activeIndex]?.muted ?? true;

    return (
        <>
            <div
                className={cn("relative h-full w-full", className)}
                ref={container}
                onMouseEnter={() => setCursorType('small')}
                onMouseLeave={() => setCursorType('default')}
            >
                <div className="sticky-cards-visual relative flex h-[100dvh] w-full items-center justify-center overflow-hidden p-3 lg:p-8">


                    {/* Main Stack Container - fixed height to viewport */}
                    <div className="relative w-full h-full max-w-7xl flex items-center justify-center pt-24 md:pt-0">

                        <div className="absolute top-24 md:top-8 left-6 z-40 flex flex-col items-center md:items-start text-center md:text-left">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-black dark:text-white">Visual Productions</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                                Motion graphics, video editing, and visual storytelling.
                            </p>
                        </div>

                        {mediaItems.map((item, i) => {
                            const state = cardStates[i] || { muted: true, volume: 1, playing: false };

                            return (
                                <div
                                    key={item.id}
                                    className="absolute inset-0 flex items-center justify-center will-change-transform pt-24 md:pt-0"
                                    ref={(el) => { cardRefs.current[i] = el; }}
                                >
                                    <div className="relative">
                                        {/* THE VISUAL CARD - Adapts to content size */}
                                        <div
                                            className="visual-card relative max-h-[60dvh] md:max-h-[85dvh] max-w-full shadow-[0_35px_60px_-15px_rgba(0,0,0,0.8)] rounded-3xl overflow-hidden group bg-neutral-900 mx-4 z-10"
                                            onMouseEnter={() => setCursorType('video')}
                                            onMouseLeave={() => setCursorType('small')}
                                        >

                                            {item.type === "video" ? (
                                                <video
                                                    src={item.src}
                                                    className="max-h-[60dvh] md:max-h-[85dvh] w-auto max-w-full object-contain cursor-pointer"
                                                    muted={state.muted}
                                                    loop
                                                    playsInline
                                                    suppressHydrationWarning
                                                    onPlay={() => updateCardState(i, { playing: true })}
                                                    onPause={() => updateCardState(i, { playing: false })}
                                                    onClick={(e) => { e.stopPropagation(); setSelectedVideo(item); }}
                                                />
                                            ) : (
                                                <img
                                                    src={item.src}
                                                    alt={item.alt || ""}
                                                    className="max-h-[60dvh] md:max-h-[85dvh] w-auto max-w-full object-contain"
                                                />
                                            )}

                                            {/* Controls Overlay */}
                                            <div
                                                className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                                onMouseEnter={(e) => { e.stopPropagation(); setCursorType('small'); }}
                                                onMouseLeave={() => setCursorType('video')}
                                            >
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
                                                                onClick={(e) => { e.stopPropagation(); setFullscreenVideo(item); }}
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

                                        {/* AMBIENT GLOW BACKDROP */}
                                        <div className={cn("absolute inset-0 z-[-1] blur-[40px] scale-[1.02] pointer-events-none transition-all duration-700 mx-4", i === activeIndex ? "opacity-60" : "opacity-0")}>
                                            {item.type === 'video' ? (
                                                <video
                                                    src={item.src}
                                                    className="w-full h-full object-cover rounded-3xl"
                                                    muted
                                                    loop
                                                    playsInline
                                                />
                                            ) : (
                                                <img src={item.src} className="w-full h-full object-cover rounded-3xl" alt="" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Global Floating Audio Toggle */}
                        <button
                            onClick={(e) => { e.stopPropagation(); handleGlobalToggle(); }}
                            className="absolute bottom-24 md:bottom-auto top-auto md:top-8 right-6 z-[60] p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-black/70 transition-colors shadow-2xl cursor-pointer pointer-events-auto"
                            aria-label="Toggle All Videos Audio"
                        >
                            {activeMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                        </button>
                    </div>
                </div>
            </div >

            {selectedVideo && (
                <VideoDetailsModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
            )}

            {/* 4. Render Simple Fullscreen Overlay */}
            <AnimatePresence>
                {fullscreenVideo && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl" onClick={() => setFullscreenVideo(null)}>
                        {/* Ambient Glow */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                            <video
                                src={fullscreenVideo.src}
                                className="w-[100vw] h-[100vh] object-cover blur-[150px] opacity-40 scale-125"
                                muted loop playsInline autoPlay
                            />
                        </div>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative z-10 w-full max-w-[90vw] aspect-video max-h-[90vh] rounded-xl overflow-hidden shadow-2xl bg-black"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <video
                                src={fullscreenVideo.src}
                                className="w-full h-full object-contain"
                                autoPlay
                                controls
                                controlsList="nodownload"
                                onContextMenu={(e) => e.preventDefault()}
                            />
                            <button
                                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full z-50 backdrop-blur-md transition-colors"
                                onClick={(e) => { e.stopPropagation(); setFullscreenVideo(null); }}
                            >
                                <X size={24} />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export const VisualProductionShowcase = () => {
    const [videos, setVideos] = useState<MediaData[]>([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                let firestoreVideos: MediaData[] = [];
                const { db } = await import("@/lib/firebase");
                const { collection, getDocs, query, orderBy } = await import("firebase/firestore");

                if (db) {
                    const q = query(collection(db, "visual_productions"), orderBy("createdAt", "desc"));
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        firestoreVideos = querySnapshot.docs.map(doc => {
                            const data = doc.data();
                            return {
                                id: doc.id,
                                src: data.src,
                                type: data.type as "video" | "image",
                                alt: data.code || data.alt,
                                title: data.title,
                                year: data.year,
                                category: data.category,
                                brandCategories: data.brandCategories,
                                insight: data.insight,
                                description: data.description,
                                services: data.services,
                                tools: data.tools,
                                caseStudyUrl: data.caseStudyUrl,
                                liveWebsiteUrl: data.liveWebsiteUrl
                            };
                        });
                    }
                }

                if (firestoreVideos.length > 0) {
                    setVideos(firestoreVideos);
                    return;
                }

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
