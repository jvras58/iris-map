import { auth } from "@/lib/auth";
import ProfileForm from "@/modules/auth/components/ProfileForm";
import { ProfileService } from "@/modules/auth/service/profile";

import { User } from "lucide-react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Carteirinha",
};

const ORIENTATION_OPTIONS = [
  "Heterossexual",
  "Homossexual",
  "Bissexual",
  "Pansexual",
  "Assexual",
  "Demissexual",
  "Prefiro não informar",
  "Outro",
];

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const userProfile = await ProfileService.getUserProfile(session.user.id);

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Usuário não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <User className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Carteirinha</h1>
          </div>
          <ProfileForm
            userProfile={userProfile}
            orientationOptions={ORIENTATION_OPTIONS}
          />
        </div>
      </div>
    </div>
  );
}