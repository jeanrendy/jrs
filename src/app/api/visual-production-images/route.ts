import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

export async function GET() {
    const directoryPath = path.join(process.cwd(), 'public/assets/card/visuals');

    try {
        const files = fs.readdirSync(directoryPath);
        // Filter for image files
        const images = files.filter(file => /\.(png|jpe?g|svg|webp)$/i.test(file));
        // Return full public paths
        const publicPaths = images.map(file => `/assets/card/visuals/${file}`);
        return NextResponse.json(publicPaths, {
            headers: {
                'Cache-Control': 'no-store, max-age=0',
            },
        });
    } catch (error) {
        console.error("Error reading visual production dir:", error);
        return NextResponse.json([], { status: 200 }); // Return empty array comfortably
    }
}
