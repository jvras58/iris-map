import Navigation from "@/components/navbar";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full">
      <Navigation />
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}