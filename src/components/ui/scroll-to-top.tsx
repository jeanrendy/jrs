"use client";

import { useEffect } from "react";

export function ScrollToTop() {
    useEffect(() => {
        // Force scroll to top on mount
        window.scrollTo(0, 0);

        // Disable browser's default scroll restoration
        if (typeof window !== "undefined" && window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }, []);

    return null;
}
