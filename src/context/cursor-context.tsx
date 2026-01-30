"use client";
import { createContext, useContext, useState } from "react";

export type CursorType = 'default' | 'detail' | 'video' | 'small';

const CursorContext = createContext({
    isHovered: false,
    setIsHovered: (v: boolean) => { },
    cursorType: 'default' as CursorType,
    setCursorType: (v: CursorType) => { },
});

export const CursorProvider = ({ children }: { children: React.ReactNode }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [cursorType, setCursorType] = useState<CursorType>('default');

    return (
        <CursorContext.Provider value={{ isHovered, setIsHovered, cursorType, setCursorType }}>
            {children}
        </CursorContext.Provider>
    );
};

export const useCursor = () => useContext(CursorContext);
