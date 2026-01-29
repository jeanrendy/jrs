"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Simulate network delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800));

        if (username === "jrs" && password === "Matari10") {
            // Success
            // You might want to set a cookie or local storage here
            localStorage.setItem("admin_auth", "true");
            router.push("/admin/dashboard");
        } else {
            setError("Invalid credentials. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 relative overflow-hidden">
            {/* Background Effects - Subtle and lighter */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-200/40 blur-[128px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-200/40 blur-[128px]" />

            <div className="w-full max-w-md px-8 relative z-10">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tighter mb-2 text-gray-900">Admin<span className="text-gray-400">Panel</span></h1>
                    <p className="text-gray-500">Secure access to your creative space.</p>
                </div>

                <Card className="border-gray-200 bg-white shadow-xl shadow-gray-200/50">
                    <CardHeader>
                        <CardTitle className="text-gray-900">Welcome Back</CardTitle>
                        <CardDescription className="text-gray-500">Enter your credentials to continue.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Username</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Enter your username"
                                        className="pl-10 bg-gray-50 border-gray-200 text-gray-900 focus-visible:ring-1 focus-visible:ring-gray-400 placeholder:text-gray-400"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700">Password</label>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 bg-gray-50 border-gray-200 text-gray-900 focus-visible:ring-1 focus-visible:ring-gray-400 placeholder:text-gray-400"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-black text-white hover:bg-gray-800"
                                disabled={isLoading}
                            >
                                {isLoading ? "Authenticating..." : "Sign In"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center border-t border-gray-100 pt-6 pb-6">
                        <p className="text-xs text-gray-400 text-center max-w-[200px]">
                            Restricted access. Authorized personnel only.
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
