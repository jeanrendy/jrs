export interface Website {
    id?: string;
    title: string;
    url: string;
    description: string;
    techStack: string[];
    year: string;
    order?: number;
    createdAt?: any;
}

export const STATIC_WEBSITES: Website[] = [
    {
        title: "Gelap.my.id",
        url: "https://gelap.my.id",
        description: "Personal Website",
        techStack: ["Next.js", "TailwindCSS", "Framer Motion", "Vercel"],
        year: "2024",
        order: 0
    },
    {
        title: "Tryoneco",
        url: "https://www.tryoneco.com/",
        description: "Innovative Platform",
        techStack: ["React", "Node.js", "MongoDB", "AWS"],
        year: "2023",
        order: 1
    },
    {
        title: "ProdigyBuild",
        url: "https://prodigybuild.com/",
        description: "AI-Powered Construction Platform",
        techStack: ["React", "Python", "AWS", "TensorFlow"],
        year: "2023",
        order: 2
    },
    {
        title: "YFood",
        url: "https://yfood.com/",
        description: "Smart Food Solutions",
        techStack: ["Shopify", "Liquid", "JavaScript", "Sass"],
        year: "2022",
        order: 3
    },
    {
        title: "Seabuddy",
        url: "https://seabuddy.co/",
        description: "Ocean Conservation Platform",
        techStack: ["Vue.js", "Nuxt", "Supabase", "Tailwind"],
        year: "2024",
        order: 4
    },
    {
        title: "Atelier Jolie",
        url: "https://www.atelierjolie.com/",
        description: "Fashion Brand",
        techStack: ["Next.js", "Contentful", "Vercel", "GSAP"],
        year: "2023",
        order: 5
    },
    {
        title: "Resimate",
        url: "https://www.resimate.build/",
        description: "Construction Tech",
        techStack: ["React", "Express", "PostgreSQL", "Docker"],
        year: "2023",
        order: 6
    },
    {
        title: "Plum",
        url: "https://www.plum.io/",
        description: "HR Tech Platform",
        techStack: ["Angular", "TypeScript", "Node.js", "RxJS"],
        year: "2022",
        order: 7
    },
    {
        title: "Barbearia App",
        url: "https://barbearia-159993298310.us-west1.run.app/",
        description: "Barber Shop Application",
        techStack: ["Flutter", "Firebase", "Google Cloud", "Dart"],
        year: "2023",
        order: 8
    }
];
