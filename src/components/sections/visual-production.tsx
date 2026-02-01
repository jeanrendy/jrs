"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Volume2, VolumeX, Maximize, Play, Pause, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCursor } from "@/context/cursor-context";

// --- Helpers ---
const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const getYouTubeThumbnail = (id: string | null) => {
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
};

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

    const ytId = getYouTubeId(video?.src || "");
    const isYouTube = !!ytId;

    useEffect(() => {
        if (!isYouTube && videoRef.current) {
            videoRef.current.play().catch(() => setIsPlaying(false));
            videoRef.current.volume = volume;
            videoRef.current.muted = isMuted;
        }
    }, [video, volume, isMuted, isYouTube]);

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isYouTube) return;
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
        if (isYouTube) return;
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
        if (isYouTube) return;
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
            videoRef.current.muted = newVolume === 0;
        }
    };

    if (!video) return null;

    const thumbnailUrl = isYouTube ? getYouTubeThumbnail(ytId) : video.src;

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

                {/* Ambient BG for Modal */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                    {isYouTube ? (
                        <img
                            src={thumbnailUrl}
                            className="w-[80vw] h-[80vh] object-cover blur-[100px] opacity-40 scale-110"
                            alt=""
                        />
                    ) : (
                        <video
                            src={video.src}
                            className="w-[80vw] h-[80vh] object-cover blur-[100px] opacity-40 scale-110"
                            muted loop playsInline autoPlay
                        />
                    )}
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
                        {isYouTube ? (
                            <iframe
                                src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                                className="w-full h-full"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <>
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
                            </>
                        )}
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

    const [cardStates, setCardStates] = useState<CardState[]>([]);
    const activeIndexRef = useRef(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedVideo, setSelectedVideo] = useState<MediaData | null>(null);

    useEffect(() => {
        if (mediaItems.length > 0 && cardStates.length !== mediaItems.length) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCardStates(new Array(mediaItems.length).fill({ muted: true, volume: 1, playing: false }));
        }
    }, [mediaItems, cardStates.length]);

    useGSAP(
        () => {
            gsap.registerPlugin(ScrollTrigger);

            const cardElements = cardRefs.current.filter(el => el !== null);
            const totalCards = cardElements.length;

            if (totalCards === 0) return;

            cardElements.forEach((el, index) => {
                if (index === 0) {
                    gsap.set(el, { y: "0%", scale: 1, rotation: 0 });
                } else {
                    gsap.set(el, { y: "100%", scale: 1, rotation: 0 });
                }
            });

            // Auto-play first if video (not YT)
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
                    onUpdate: (self) => {
                        // Calculate active index based on scroll progress
                        const progress = self.progress;
                        const newIndex = Math.min(
                            Math.round(progress * (totalCards - 1)),
                            totalCards - 1
                        );

                        if (activeIndexRef.current !== newIndex) {
                            activeIndexRef.current = newIndex;
                            setActiveIndex(newIndex);
                        }
                    },
                    onLeave: () => {
                        cardElements.forEach(el => {
                            el?.querySelectorAll('video').forEach(v => v.pause());
                        });
                    },
                    onEnterBack: () => {
                        const idx = activeIndexRef.current;
                        cardElements[idx]?.querySelectorAll('video').forEach(v => v.play().catch(() => { }));
                    }
                },
            });

            // Scroll Animation Logic
            for (let i = 0; i < totalCards - 1; i++) {
                const currentCard = cardElements[i];
                const nextCard = cardElements[i + 1];
                const position = i / (totalCards - 1); // Normalize position to 0-1 for timeline if needed, but 'i' works with 'end' calc
                // Actually, standard timeline distribution:
                // We want the transitions to happen sequentially.
                // The duration logic in previous code was 'duration: 1', implying relative timing.

                scrollTimeline.to(currentCard, { scale: 0.7, rotation: 5, opacity: 0.6, duration: 1, ease: "none" }, i);
                const currentInner = currentCard.querySelector('.visual-card');
                if (currentInner) {
                    scrollTimeline.to(currentInner, { boxShadow: "none", duration: 1, ease: "none" }, i);
                }
                scrollTimeline.to(nextCard, { y: "0%", duration: 1, ease: "none" }, i);
            }

            ScrollTrigger.refresh();

            return () => {
                scrollTimeline.kill();
            };
        },
        { scope: container, dependencies: [mediaItems] }
    );

    const togglePlay = (e: React.MouseEvent, index: number, isYouTube: boolean = false) => {
        e.stopPropagation();

        // Native Video Logic
        const card = cardRefs.current[index];
        if (!isYouTube) {
            const videos = card?.querySelectorAll('video');
            videos?.forEach(video => {
                if (video.paused) video.play().catch(() => { });
                else video.pause();
            });
            return;
        }

        // YouTube Logic
        // Find iframe
        const iframe = card?.querySelector('iframe');
        if (iframe && iframe.contentWindow) {
            const currentState = cardStates[index];
            if (currentState.playing) {
                iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                // Optimistically update state since we can't easily listen to iframe events without API wrapper
                updateCardState(index, { playing: false }, true);
            } else {
                iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                updateCardState(index, { playing: true }, true);
            }
        }
    };

    const updateCardState = (index: number, newState: Partial<CardState>, isYouTube: boolean = false) => {
        setCardStates(prev => {
            const next = [...prev];
            next[index] = { ...next[index], ...newState };
            return next;
        });

        const card = cardRefs.current[index];

        if (!isYouTube) {
            const videos = card?.querySelectorAll('video');
            videos?.forEach(video => {
                if (newState.muted !== undefined) video.muted = newState.muted;
                if (newState.volume !== undefined) video.volume = newState.volume;
            });
        } else {
            const iframe = card?.querySelector('iframe');
            if (iframe && iframe.contentWindow) {
                if (newState.muted !== undefined) {
                    if (newState.muted) {
                        iframe.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
                    } else {
                        iframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
                    }
                }
                if (newState.volume !== undefined) {
                    // YouTube volume is 0-100
                    const vol = Math.floor(newState.volume * 100);
                    iframe.contentWindow.postMessage(`{"event":"command","func":"setVolume","args":[${vol}]}`, '*');
                    if (vol > 0) {
                        iframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
                    }
                }
            }
        }
    };

    const [isGlobalMuted, setIsGlobalMuted] = useState(true);

    const toggleGlobalMute = () => {
        const newMutedState = !isGlobalMuted;
        setIsGlobalMuted(newMutedState);

        // Update all card states
        const newCardStates = cardStates.map(state => ({ ...state, muted: newMutedState }));
        setCardStates(newCardStates);

        // Apply to all active DOM elements
        cardRefs.current.forEach((card, index) => {
            if (!card) return;
            const isYT = !!card.querySelector('iframe');

            if (isYT) {
                const iframe = card.querySelector('iframe');
                if (iframe && iframe.contentWindow) {
                    const cmd = newMutedState ? 'mute' : 'unMute';
                    iframe.contentWindow.postMessage(`{"event":"command","func":"${cmd}","args":""}`, '*');
                }
            } else {
                const videos = card.querySelectorAll('video');
                videos.forEach(v => { v.muted = newMutedState; });
            }
        });
    };

    return (
        <>
            <div
                className={cn("relative h-full w-full", className)}
                ref={container}
                id="video-productions"
                onMouseEnter={() => setCursorType('small')}
                onMouseLeave={() => setCursorType('default')}
            >
                <div className="sticky-cards-visual relative flex h-[100dvh] w-full items-center justify-center overflow-hidden p-3 lg:p-8">
                    <div className="relative w-full h-full max-w-7xl flex items-center justify-center pt-24 md:pt-0">
                        <div className="absolute top-24 md:top-8 left-0 w-full z-40 flex flex-col items-center md:items-start text-center md:text-left px-6">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-black dark:text-white">Video Productions</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto md:mx-0">
                                Motion graphics, video editing, and visual storytelling.
                            </p>
                        </div>

                        {/* Global Mute Toggle */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleGlobalMute();
                            }}
                            className="absolute top-24 md:top-8 right-6 z-50 p-3 bg-black/40 backdrop-blur-md rounded-full text-white/90 hover:bg-black/60 transition-colors border border-white/10"
                            title={isGlobalMuted ? "Unmute All" : "Mute All"}
                        >
                            {isGlobalMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>

                        {mediaItems.map((item, i) => {
                            const state = cardStates[i] || { muted: true, volume: 1, playing: false };
                            const ytId = getYouTubeId(item.type === 'video' ? item.src : "");
                            const isYouTube = !!ytId;

                            return (
                                <div
                                    key={item.id}
                                    className="absolute inset-0 flex items-center justify-center will-change-transform pt-24 md:pt-0"
                                    ref={(el) => { cardRefs.current[i] = el; }}
                                >
                                    <div className="relative">
                                        <div
                                            className="visual-card relative max-h-[60dvh] md:max-h-[85dvh] max-w-full shadow-[0_35px_60px_-15px_rgba(0,0,0,0.8)] rounded-3xl overflow-hidden group bg-black flex items-center justify-center mx-4 z-10"
                                            onMouseEnter={() => setCursorType('video')}
                                            onMouseLeave={() => setCursorType('small')}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedVideo(item);
                                            }}
                                        >
                                            {item.type === "video" ? (
                                                isYouTube ? (
                                                    // YouTube: Play Iframe if Active, else Thumbnail
                                                    <div className="relative w-[90vw] md:w-[75vw] max-w-[1200px] aspect-video flex items-center justify-center bg-black cursor-pointer overflow-hidden">
                                                        {i === activeIndex ? (
                                                            <div className="w-full h-full pointer-events-none select-none">
                                                                <iframe
                                                                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&showinfo=0&modestbranding=1&iv_load_policy=3&rel=0&disablekb=1&fs=0&enablejsapi=1`}
                                                                    className="w-[100%] h-[100%] object-cover scale-[1.35]"
                                                                    style={{ pointerEvents: 'none' }}
                                                                    title="YouTube background"
                                                                    frameBorder="0"
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="relative w-full h-full flex items-center justify-center">
                                                                <img
                                                                    src={getYouTubeThumbnail(ytId)}
                                                                    className="w-full h-full object-cover opacity-80"
                                                                    alt={item.alt || ""}
                                                                />
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
                                                                        <Play className="w-8 h-8 text-white/50 fill-current" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    // Native Video
                                                    <video
                                                        src={item.src}
                                                        className="max-h-[60dvh] md:max-h-[85dvh] w-auto max-w-full object-contain cursor-pointer"
                                                        muted={state.muted}
                                                        loop
                                                        playsInline
                                                        suppressHydrationWarning
                                                        onPlay={() => updateCardState(i, { playing: true })}
                                                        onPause={() => updateCardState(i, { playing: false })}
                                                    />
                                                )
                                            ) : (
                                                <img
                                                    src={item.src}
                                                    alt={item.alt || ""}
                                                    className="max-h-[60dvh] md:max-h-[85dvh] w-auto max-w-full object-contain"
                                                />
                                            )}

                                            {/* Controls Overlay (For Native & YouTube) */}
                                            {item.type === "video" && (
                                                <div
                                                    className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                                    onMouseEnter={(e) => { e.stopPropagation(); setCursorType('small'); }}
                                                    onMouseLeave={() => setCursorType('video')}
                                                >
                                                    <div className="flex items-center gap-2 pointer-events-auto">
                                                        <button
                                                            onClick={(e) => togglePlay(e, i, isYouTube)}
                                                            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
                                                            title={state.playing ? "Pause" : "Play"}
                                                        >
                                                            {state.playing ? <Pause size={18} /> : <Play size={18} />}
                                                        </button>

                                                        <VolumeControl
                                                            isMuted={state.muted}
                                                            volume={state.volume}
                                                            onToggleMute={() => {
                                                                // Local toggle affects global state for consistency? 
                                                                // Or just this card? 
                                                                // Requirement says "click the toggle to muted... all video will be muted". 
                                                                // The overlay volume control is per-card, but the floating one is global.
                                                                // I'll keep the overlay control local to the card for fine-tuning, 
                                                                // but maybe it should also update global?
                                                                // For now, I'll keep this local as per standard UI, or sync it.
                                                                // Let's make it sync global state actually, for consistency.
                                                                toggleGlobalMute();
                                                            }}
                                                            onVolumeChange={(val) => {
                                                                updateCardState(i, { volume: val, muted: val === 0 }, isYouTube);
                                                            }}
                                                        />
                                                        {/* Fullscreen handled via Modal selection */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const card = cardRefs.current[i];
                                                                const visualInner = card?.querySelector('.visual-card');
                                                                if (visualInner) {
                                                                    if (!document.fullscreenElement) {
                                                                        visualInner.requestFullscreen().catch(err => console.error(err));
                                                                    } else {
                                                                        document.exitFullscreen();
                                                                    }
                                                                }
                                                            }}
                                                            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
                                                            title="Fullscreen"
                                                        >
                                                            <Maximize size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Ambient Glow */}
                                        <div className={cn("absolute inset-0 z-[-1] blur-[40px] scale-[1.02] pointer-events-none transition-all duration-700 mx-4", i === activeIndex ? "opacity-60" : "opacity-0")}>
                                            {isYouTube ? (
                                                <img src={getYouTubeThumbnail(ytId)} className="w-full h-full object-cover rounded-3xl" alt="" />
                                            ) : item.type === 'video' ? (
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
                    </div>
                </div>
            </div >

            {selectedVideo && (
                <VideoDetailsModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
            )
            }
        </>
    );
};

export const VisualProductionShowcase = () => {
    const [videos, setVideos] = useState<MediaData[]>([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                // Ensure Firebase is loaded client-side if detecting standard
                let firestoreVideos: MediaData[] = [];
                const { db } = await import("@/lib/firebase");
                const { collection, getDocs, query, orderBy, Firestore } = await import("firebase/firestore");

                if (db) {
                    const q = query(collection(db, "visual_productions"), orderBy("createdAt", "desc"));
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        firestoreVideos = querySnapshot.docs.map(doc => {
                            const data = doc.data();
                            return {
                                id: doc.id,
                                src: data.src || data.thumbnailUrl, // Fallback
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

                // Fallback to API if DB is empty or fails
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
