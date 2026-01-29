import { SmoothScroll } from "@/components/smooth-scroll";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CursorProvider } from "@/context/cursor-context";
import { Cursor } from "@/components/ui/cursor";

export default function SiteLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <CursorProvider>
            <SmoothScroll>
                <div className="relative z-10 bg-background rounded-b-[40px] md:rounded-b-[80px] shadow-2xl mb-[600px] md:mb-[700px] overflow-hidden">
                    <Navbar />
                    <main className="min-h-screen">
                        {children}
                    </main>
                </div>
                <Footer />
            </SmoothScroll>
            <Cursor />
        </CursorProvider>
    );
}
