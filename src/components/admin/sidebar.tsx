"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PenTool, Image as ImageIcon, Settings, LogOut } from "lucide-react";

const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Landing Page", href: "/admin/landing", icon: PenTool },
    { name: "Portfolio", href: "/admin/portfolio", icon: ImageIcon },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.removeItem("admin_auth");
        window.location.href = "/admin";
    };

    return (
        <div className="w-64 h-screen bg-black text-white flex flex-col border-r border-gray-800">
            <div className="p-6">
                <h1 className="text-2xl font-bold tracking-tighter">JeanRendy<span className="text-gray-500">.</span></h1>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Admin Panel</p>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all",
                                isActive
                                    ? "bg-white text-black shadow-md"
                                    : "text-gray-400 hover:text-white hover:bg-white/10"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
