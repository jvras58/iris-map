'use server';

import { prisma } from '@/lib/prisma';

// import { UserRole } from "@prisma/client"
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import bcryptjs from 'bcryptjs';
import type { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { RegisterformSchema } from '@/modules/auth/schemas/register-schema';

export const register = async (user: z.infer<typeof RegisterformSchema>) => {
  const validationResult = RegisterformSchema.safeParse(user);

  if (!validationResult.success) {
    return {
      error: 'Dados inválidos',
      fieldErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const {
      name,
      email,
      password,
    } = validationResult.data;
    const hashedPassword = await bcryptjs.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          //   role: UserRole.DEFAULT,
        },
      });

      return createdUser;
    });

    revalidatePath('/auth/login');

    return {
      success: 'Conta criada com sucesso',
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
      },
    };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return {
          error: 'Já existe uma conta relacionada a este e-mail.',
        };
      }
    }

    console.error('Erro ao registrar usuário:', error);
    return {
      error: 'Ocorreu um erro ao criar sua conta. Tente novamente mais tarde.',
    };
  }
};