"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Hero, CompanyLogo } from "@/components/sections/hero-v2";
import { CreativeStack } from "@/components/sections/creative-stack";
import { FeaturesSection } from "@/components/sections/features";
import { PortfolioShowcase } from "@/components/sections/portfolio-showcase";
import { VisualProductionShowcase } from "@/components/sections/visual-production";
import { AboutExperience } from "@/components/sections/about-experience";
import { LatestPosts, BlogContent } from "@/components/sections/latest-posts";

interface PageContent {
  hero?: {
    availabilityText?: string;
    titleLine1?: string;
    titleLine2?: string;
    titleLine3Part1?: string;
    titleLine3Part2?: string;
    description?: string;
  };
  digitalPlayground?: {
    title?: string;
    description?: string;
  };
  blog?: BlogContent;
}

export default function Home() {
  const [content, setContent] = useState<PageContent | null>(null);
  const [companyLogos, setCompanyLogos] = useState<CompanyLogo[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      if (!db) return; // Skip if firebase not configured

      try {
        const docRef = doc(db, "pages", "home");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent(docSnap.data() as PageContent);
        }
      } catch (error) {
        console.error("Error fetching page content:", error);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await fetch('/api/company-logos');
        const logos = await response.json();
        setCompanyLogos(logos);
      } catch (error) {
        console.error("Error fetching company logos:", error);
      }
    };

    fetchLogos();
  }, []);

  return (
    <main className="block min-h-screen">
      <div className="sticky top-0 z-0 snap-start">
        <Hero companyLogos={companyLogos} content={content?.hero} />
      </div>
      <div className="relative z-20 bg-background">
        <div className="snap-start min-h-screen flex flex-col justify-center">
          <CreativeStack />
        </div>
        <div id="work" className="snap-start min-h-screen flex flex-col justify-center">
          <PortfolioShowcase />
        </div>
        <div className="snap-start min-h-screen flex flex-col justify-center">
          <VisualProductionShowcase />
        </div>

        <div id="about" className="snap-start min-h-screen flex flex-col justify-center">
          <AboutExperience />
        </div>

        <div className="snap-start min-h-[50vh] md:min-h-screen flex flex-col justify-center">
          <FeaturesSection content={content?.digitalPlayground} />
        </div>
      </div>
    </main>
  );
}
