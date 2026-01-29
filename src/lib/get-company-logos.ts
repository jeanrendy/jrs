import fs from 'fs';
import path from 'path';

export interface CompanyLogo {
    name: string;
    src: string;
}

export function getCompanyLogos(): CompanyLogo[] {
    const logoDirectory = path.join(process.cwd(), 'public', 'assets', 'companylogo');

    try {
        const files = fs.readdirSync(logoDirectory);

        // Filter for SVG files and exclude placeholder logos
        const logoFiles = files.filter(file =>
            file.endsWith('.svg') && !file.startsWith('logocompany')
        );

        return logoFiles.map(file => ({
            name: file.replace('.svg', '').replace(/_/g, ' '),
            src: `/assets/companylogo/${file}`
        }));
    } catch (error) {
        console.error('Error reading company logos:', error);
        return [];
    }
}
