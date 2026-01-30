"use client";
import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export default function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
    // Dynamic import to avoid SSR issues with Quill
    const ReactQuill = useMemo(() => dynamic(() => import('react-quill-new'), {
        ssr: false,
        loading: () => <div className="h-24 w-full bg-muted/20 animate-pulse rounded-md" />
    }), []);

    return (
        <div className={className}>
            {/* @ts-expect-error - React Quill types might be missing */}
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                className="bg-white text-black rounded-md"
            />
        </div>
    );
}
