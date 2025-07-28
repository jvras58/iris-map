import { prisma } from "@/lib/prisma";
import { UserProfile, ProfileFormData, ProfileUpdateResult } from "@/types/profile";

export class ProfileService {
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          profile: {
            select: {
              sexual_orientation: true,
              city: true,
            },
          },
        },
      });

      return user;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  }

  static async updateProfile(
    userId: string, 
    data: ProfileFormData
  ): Promise<ProfileUpdateResult> {
    try {
      await prisma.$transaction(async (tx) => {
        if (data.name) {
          await tx.user.update({
            where: { id: userId },
            data: { name: data.name },
          });
        }

        // Atualizar/criar perfil
        await tx.profile.upsert({
          where: { userId },
          update: {
            sexual_orientation: data.sexual_orientation || null,
            city: data.city || null,
          },
          create: {
            userId,
            sexual_orientation: data.sexual_orientation || null,
            city: data.city || null,
          },
        });
      });

      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return {
        success: false,
        error: {
          message: 'Erro ao atualizar perfil',
          details: error instanceof Error ? error.message : 'Erro desconhecido'
        }
      };
    }
  }
}