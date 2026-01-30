import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';



export async function GET() {
    try {
        const videoDirectory = path.join(process.cwd(), 'public/assets/video');

        if (!fs.existsSync(videoDirectory)) {
            return NextResponse.json([]);
        }

        const files = fs.readdirSync(videoDirectory);

        const videos = files
            .filter((file) => /\.(mp4|mov|webm)$/i.test(file))
            .map((file, index) => ({
                id: `video-${index}`,
                src: `/assets/video/${file}`,
                type: "video" as const,
                alt: file,
            }));

        return NextResponse.json(videos);
    } catch (error) {
        console.error('Error reading video directory:', error);
        return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
    }
}
