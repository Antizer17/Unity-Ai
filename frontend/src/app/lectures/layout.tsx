import { Navbar } from '@/components/layout/navbar';

export default function LecturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
