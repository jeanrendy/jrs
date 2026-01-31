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
    const quillRef = React.useRef<any>(null);

    // Dynamic import to avoid SSR issues with Quill
    const ReactQuill = useMemo(() => dynamic(async () => {
        const { default: RQ } = await import('react-quill-new');
        // eslint-disable-next-line react/display-name
        return ({ forwardedRef, ...props }: any) => <RQ ref={forwardedRef} {...props} />;
    }, {
        ssr: false,
        loading: () => <div className="h-24 w-full bg-muted/20 animate-pulse rounded-md" />
    }), []);

    const imageHandler = React.useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            if (input.files && input.files[0]) {
                const file = input.files[0];
                try {
                    const { uploadFile } = await import("@/lib/upload");
                    const url = await uploadFile(file, "editor-uploads");

                    if (quillRef.current) {
                        const quill = quillRef.current.getEditor();
                        const range = quill.getSelection();
                        quill.insertEmbed(range ? range.index : 0, 'image', url);
                    }
                } catch (error) {
                    console.error("Image upload failed", error);
                    alert("Image upload failed");
                }
            }
        };
    }, []);

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    }), [imageHandler]);

    return (
        <div className={className}>
            <ReactQuill
                forwardedRef={quillRef}
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                className="bg-white text-black rounded-md"
            />
        </div>
    );
}
