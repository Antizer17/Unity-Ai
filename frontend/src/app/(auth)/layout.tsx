export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-violet-500/15 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg px-4 py-12">
        {children}
      </div>
    </div>
  );
}
