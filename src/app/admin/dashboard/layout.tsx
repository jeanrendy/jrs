import Link from "next/link";
import { LayoutDashboard, Settings, User, FileText, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-200 bg-white flex flex-col justify-between p-6 hidden md:flex">
                <div className="space-y-8">
                    <div className="flex items-center gap-2 px-2">
                        <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center text-white font-bold">
                            J
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900">Admin<span className="text-gray-400">Panel</span></span>
                    </div>

                    <nav className="space-y-2">
                        <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 text-gray-900 font-medium hover:bg-gray-200 transition-all">
                            <LayoutDashboard className="h-5 w-5" />
                            Dashboard
                        </Link>
                        <Link href="/admin/dashboard/blog" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
                            <FileText className="h-5 w-5" />
                            Blog Posts
                        </Link>
                        <Link href="/admin/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
                            <Settings className="h-5 w-5" />
                            Settings
                        </Link>
                    </nav>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
                        <User className="h-8 w-8 p-1.5 rounded-full bg-white border border-gray-200 text-gray-700" />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">Jean Rendy</span>
                            <span className="text-xs text-gray-500">Admin</span>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full justify-start gap-3 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50" asChild>
                        <Link href="/admin">
                            <LogOut className="h-4 w-4" />
                            Logout
                        </Link>
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
                {children}
            </main>
        </div>
    );
}
