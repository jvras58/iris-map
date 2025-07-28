import Navigation from "@/modules/auth/components/navbar";
import { AuthTabProvider } from "@/modules/auth/hooks/use-auth-tabs";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full">
      <AuthTabProvider>
        <Navigation />
        <main className="w-full">
          {children}
        </main>
      </AuthTabProvider>
    </div>
  );
}