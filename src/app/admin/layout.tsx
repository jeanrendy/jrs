"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { ThemeProvider } from "next-themes";

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/admin";

    return (
        <ThemeProvider forcedTheme="light" attribute="class">
            <div className="min-h-screen bg-gray-50 text-gray-900 flex">
                {!isLoginPage && <AdminSidebar />}
                <div className="flex-1 overflow-auto max-h-screen">
                    {children}
                </div>
            </div>
        </ThemeProvider>
    );
}
