import { NextResponse } from 'next/server';
import { getCompanyLogos } from '@/lib/get-company-logos';

export const dynamic = 'force-static';


export async function GET() {
    try {
        const logos = getCompanyLogos();
        return NextResponse.json(logos);
    } catch (error) {
        console.error('Error fetching company logos:', error);
        return NextResponse.json([], { status: 500 });
    }
}
