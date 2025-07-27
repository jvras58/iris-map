import Navigation from "@/modules/auth/components/navbar";
import { AuthTabProvider } from "@/modules/auth/hooks/use-auth-tabs";

export default async function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex h-screen w-screen">
      <div className="flex-1 overflow-auto">
        <AuthTabProvider>
        <Navigation />
        {children}
        </AuthTabProvider>
      </div>
    </div>
  );
}