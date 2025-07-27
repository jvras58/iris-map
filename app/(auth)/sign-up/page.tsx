import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/modules/auth/components/LoginForm";
import RegisterForm from "@/modules/auth/components/RegisterForm";
import { Metadata } from "next";
import { Heart } from "lucide-react";

//[REFACTOR] CONSISTENT IN AUTH PAGES
// como estamos usando tabs para login e cadastro, talvez não faça sentido ter paginas separadas....
export const metadata: Metadata = {
  title: "Cadastro",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Conexão Íris</h1>
          </div>
          <p className="text-gray-600">Sua comunidade segura e acolhedora</p>
        </div>
        <Card className="w-full max-w-md">
          <CardContent>
            <Tabs defaultValue="register" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="register">Cadastrar</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}