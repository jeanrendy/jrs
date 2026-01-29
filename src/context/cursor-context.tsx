"use client";
import { createContext, useContext, useState } from "react";

const CursorContext = createContext({
    isHovered: false,
    setIsHovered: (v: boolean) => { },
});

export const CursorProvider = ({ children }: { children: React.ReactNode }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <CursorContext.Provider value={{ isHovered, setIsHovered }}>
            {children}
        </CursorContext.Provider>
    );
};

export const useCursor = () => useContext(CursorContext);
