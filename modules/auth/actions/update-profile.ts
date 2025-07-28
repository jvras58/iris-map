'use server';

import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

import { ProfileUpdateResult } from '@/types/profile';
import { ProfileService } from '../service/profile';
import { ProfileFormSchema, ProfileFormValues } from '../schemas/profile-edit-schema';

export async function updateProfile(data: ProfileFormValues): Promise<ProfileUpdateResult> {
  try {
    // Validar dados de entrada
    const validatedData = ProfileFormSchema.parse(data);
    
    // Verificar autenticação
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: 'Usuário não autenticado' }
      };
    }

    // Atualizar perfil
    const result = await ProfileService.updateProfile(session.user.id, validatedData);
    
    if (result.success) {
      revalidatePath('/profile');
    }
    
    return result;
  } catch (error) {
    console.error('Erro na action updateProfile:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        success: false,
        error: { message: 'Dados inválidos fornecidos' }
      };
    }
    
    return {
      success: false,
      error: { message: 'Erro interno do servidor' }
    };
  }
}