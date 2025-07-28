import Navigation from "@/components/navbar";

export default async function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex h-screen w-screen">
      <div className="flex-1 overflow-auto">
        <Navigation />
        {children}
      </div>
    </div>
  );
}