import { Card, CardContent } from "@/components/ui/card";
import { Metadata } from "next";
import { Heart } from "lucide-react";
import { AuthTabsClient } from "@/modules/auth/components/AuthTabsClient";

export const metadata: Metadata = {
  title: "Autenticação",
};

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-foreground">Conexão Íris</h1>
          </div>
          <p className="text-muted-foreground">Sua comunidade segura e acolhedora</p>
        </div>
        <Card className="w-full max-w-md">
          <CardContent>
            <AuthTabsClient />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}