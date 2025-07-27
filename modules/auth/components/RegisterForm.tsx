"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { register } from '@/actions/register';
import { RegisterFormData, RegisterformSchema } from "../schemas/register-schema";
import { useAuthTab } from "../hooks/use-auth-tabs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export default function RegisterForm() {
  const { setActiveTab } = useAuthTab();
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterformSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await register(data);

      if (result.error) {
        toast.error('Falha no cadastro', { description: result.error });
        return;
      }

      toast.success('Cadastro realizado com sucesso!', {
        description: 'Agora você pode fazer login.',
      });
      setActiveTab('login');
    } catch (err) {
      if (err instanceof Error) {
        toast.error('Ocorreu um erro inesperado. Tente novamente', {
          description: err.message,
        });
      }
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-2 mb-6">
        <h2 className="text-2xl font-semibold text-center">Crie sua conta</h2>
        <p className="text-sm text-muted-foreground text-center">
          Preencha os dados abaixo para criar sua conta
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 min-h-[280px]">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </form>
    </Form>
  );
}
