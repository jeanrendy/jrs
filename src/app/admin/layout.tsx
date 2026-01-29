export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Enforcing light theme styles by resetting text and background variables locally
    // and ensuring the background is white.
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900" data-theme="light">
            {children}
        </div>
    );
}
