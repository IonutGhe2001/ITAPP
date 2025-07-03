export default function DashboardSectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl shadow-2xl shadow-pink-100/50 backdrop-blur-xl bg-white/80 border-0 p-8 transition-transform hover:scale-105 duration-300 ease-out">
      {children}
    </div>
  );
}
