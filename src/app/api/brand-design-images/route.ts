import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

export async function GET() {
    const directoryPath = path.join(process.cwd(), 'public/assets/card/branddesign');

    try {
        const files = fs.readdirSync(directoryPath);
        // Filter for image files
        const images = files.filter(file => /\.(png|jpe?g|svg|webp)$/i.test(file));
        // Return full public paths
        const publicPaths = images.map(file => `/assets/card/branddesign/${file}`);
        return NextResponse.json(publicPaths);
    } catch (error) {
        console.error("Error reading brand design dir:", error);
        return NextResponse.json([], { status: 200 });
    }
}
